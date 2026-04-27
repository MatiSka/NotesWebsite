export type note = {
    _id:            string,
    title:          string,
    content:        string,
    tags:           string[],
    isPinned:       boolean,
    createdDate:    string,
    userId:         string,
}