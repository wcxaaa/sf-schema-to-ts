export const fieldMappings: {[index: string]: string} = {
  // Salesforce Schema Type => TypeScript type
  
  reference: "REFERENCE_TYPE", // "string", needs futher processing

  // Primitive types
  base64: "string",
  boolean: "boolean",
  byte: "number",
  date: "Date",
  dateTime: "Date",
  double: "number",
  int: "number",
  long: "number",
  string: "string",
  time: "Date",
  
  // Field Types
  address: "string",
  anyType: "any",
  calculated: "any",
  combobox: "string",
  currency: "number",
  DataCategoryGroupReference: "string",
  email: "string",
  encryptedstring: "string",
  ID: "string",
  JunctionIdList: "string[]",
  location: "string",
  masterrecord: "string",
  multipicklist: "string",
  percent: "number",
  phone: "string",
  picklist: "string",
  textarea: "string",
  url: "string",
}