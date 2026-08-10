export interface MyBooks {
    content: {
        id: number,
        title: string,
        author: string,
        status: string,
        coverUrl: string,
    }[],
    pageable: {
        pageNumber: number,
    },
    totalPages: number,
}