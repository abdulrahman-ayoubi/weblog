exports.contactSchema = {
    fullName: {
        type: "string",
        min: 4,
        max: 50,
        messages: {
            required: "Full name is required",
            stringMin: "Full name must be at least 4 litters",
            stringMax: "Full name must be less then 50 litters",
        },
    },
    email: {
        type: 'email',
        trim: true,
        normalize: true,
        messages: {
            emailEmpty: "email field must not be empty",
            required: "email is not valid",
            string: "email is not valid",
        },
    },
    message: {
        type: "string",
        min: 4,
        max: 500,
        messages: {
            required: "your message must has some content.",
            stringMin: "the message content min length should be 4 characters.",
            stringMax: "the message content max length should be 500 characters.",

        }
    },
    captcha: {
        type: "number",
        min: 4,
        max: 4,
        messages: {
            number: "security code  is required"
        }
    }
}