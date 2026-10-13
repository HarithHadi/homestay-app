// Runs server-side in saveReceipt() before anything is uploaded.
// Return an error message to reject the file, or null to accept it.
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg','image/png','application/pdf']

export function validateReceipt(file: File): string | null {
  // and file.size against a limit (next.config.ts caps the request at 6MB).

  if(!file)return "No file detected.";

  if(!ALLOWED_TYPES.includes(file.type)){
    return "Invalid file type. Only JPEG, PNG, and PDF are allowed."
  }

  if(file.size > MAX_FILE_SIZE){
    return "File size exceeds the 5MB limit.";
  }

  console.log('File is valid:', file.name);
  

  // Fails closed until implemented, so uploads are rejected rather than unchecked.
  return null;
}
