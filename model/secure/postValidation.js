exports.postSchema = {
    title: {
        type: "string",
        min: 8,
        max: 100,
        trim: true,
        messages: {
            required: "post title should has Title.",
            stringMin: "the post title min length should be 8 characters.",
            stringMax: "the post title max length should be 80 characters.",
        }
    },
    body: {
        type: 'string',
        min: 4,
        max: 2000,
        trim: true,
        normalize: true,
        messages: {
            required: "post content should has content.",
            stringMin: "the post content min length should be 4 characters.",
            stringMax: "the post content max length should be 2000 characters.",
        }
    },
    status: {
        type: 'string',
        enum: ['private', 'public'],
        messages: {
            required: 'the post status is required. ',
            stringEnum: "the post status should be public or private."
        }
    },
}
