import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { lowerFirst, upperFirst } from "@salesforce/kit";
import { AnyJson } from "@salesforce/ts-types";
import { join } from "path";
import { writeFile } from "fs";
import { promisify } from "util";
import { fieldMappings } from "../../../fieldMappings";

const writeFileAsync = promisify(writeFile);

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sf-schema-to-ts", "sobject");

const header = `
/**
 * Generated by the sf-schema-to-ts plugin
 */
`;

export type ObjectClassInfo = {
  filePath: string,
  interfaceName: string
};

export default class SObjectCreate extends SfdxCommand {

  public static description = messages.getMessage("commandDescription");

  public static examples = [
    "$ sfdx types:sobject:create --sobject Account",
    "$ sfdx types:sobject:create --sobject MyCustomObject__c --directory types/ --targetusername myOrg@example.com"
  ];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    outputdir: flags.directory({
      char: "o",
      description: messages.getMessage("directoryFlagDescription"),
      default: "."
    }),
    sobject: flags.string({
      char: "s",
      description: messages.getMessage("sobjectFlagDescription"),
      required: true
    })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  private createdFiles: ObjectClassInfo[] = [];

  public async run(): Promise<AnyJson> {
    await this.generateSObjectType();

    if (this.createdFiles.length > 0) {
      this.ux.styledHeader("Create types");
      this.ux.table(this.createdFiles, 
        {
          filePath: {
            header: "Output File"
          },
          interfaceName: {
            header: "Interface"
          }
        }
      );
    } else {
      this.ux.log("No types created.");
    }

    // Return an object to be displayed with --json
    return { files: this.createdFiles };
  }

  private generateSObjectType = async () => {
    const conn = this.org.getConnection();
    const objectName: string = this.flags.sobject;
    const describe = await conn.describe(objectName);
    const referenceFields: (typeof describe.fields) = [];

    // Turn myNamespace__my_class__c => MyNamespaceMyClass
    const pascalObjectName = this.convertToPascalName(objectName);

    const interfaceName = `I${pascalObjectName}`;

    let typeContents = `${header}\n`;

    typeContents += `export interface ${interfaceName} {`;

    for (const field of describe.fields) {
      let typeName = fieldMappings[field.type] || "string";

      if (typeName === "REFERENCE_TYPE") {
        referenceFields.push(field);
        typeName = "string";
      }
  
      typeContents += `\n  ${field["name"]}: ${typeName};`;
    }

    typeContents += `\n`;

    // Attach relation fields
    for (const field of referenceFields) {

      const referenceToInterfaceNames = field.referenceTo.map((name) => `I${this.convertToPascalName(name)}`);
      const referenceToExpression = referenceToInterfaceNames.join(" | ");

      typeContents += `\n  ${field.relationshipName}: ${referenceToExpression};`;
    }

    // End
    typeContents += "\n}\n";

    const filePath = join(this.flags.outputdir, `${lowerFirst(pascalObjectName)}.interface.ts`);
    await writeFileAsync(filePath, typeContents);
    this.createdFiles.push({ filePath, interfaceName });
  }

  private convertToPascalName = (inputName: string): string => {
    return inputName
      // Capitalize all words
      .replace(/[a-zA-Z0-9-]+_/g, upperFirst)
      // Remove end
      .replace(/__c$/, "")
      // Replace all underscores
      .replace(/_/g, "");
  }

}
