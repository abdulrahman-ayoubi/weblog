exports.commentValidation = {
    comment: {
        type: "string",
        min: 1,
        trim: true,
        messages: {
            required: 'The comment must has some content.',
            stringMin: 'please write some comment.'
        },
    }

}