export interface PDFFile {
  id?: string;
  file: File;
  name?: string;
  citations: Citation[];
}

export interface Citation {
  id?: string;
  pdfId?: string;
  page: number;
  text?: string;
  position?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}
