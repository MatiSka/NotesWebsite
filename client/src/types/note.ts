export type note = {
    _id:            string,
    title:          string,
    content:        string,
    tags:           string[] | null,
    isPinned:       boolean,
    CreatedDate:    string,
    userId:         string
}

export type openEditNote = {
    isShow: boolean,
    type:   string,
    data:   note | null
}