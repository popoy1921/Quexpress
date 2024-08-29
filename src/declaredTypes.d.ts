declare module 'bcryptjs' {
  // Add the type declarations you need or use 'any' for a temporary solution
  export function hashSync(data: string | Buffer, salt: string | number): string;
  export function compareSync(data: string | Buffer, encrypted: string): boolean;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  // Add other function declarations as needed
} 
declare module 'react-data-table-component-extensions' {
  // Add the type declarations you need or use 'any' for a temporary solution
  export default DataTableExtensions;
}