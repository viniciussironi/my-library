export interface MyBooks {
    content: {
        id: number,
        title: string,
        author: string,
        status: string
    }[],
    pageable: {
        pageNumber: number,
    },
    totalPages: number,
}