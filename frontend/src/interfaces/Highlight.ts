export interface Highlight {
    id: string;
    bookId: number;
    color: "yellow" | "green" | "blue" | "pink";
    text: string;           
    location: string;       
    createdAt: string;
}
