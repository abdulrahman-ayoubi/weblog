exports.schema = {
    fullName: {
        type: "string",
        trim: true,
        min: 4,
        max: 255,
        optional: false,
        messages: {
            required: "Full name is required",
            stringMin: "Full name must be at least 4 litters",
            stringMax: "Full name must be less then 255 litters",
        },
    },
    email: {
        type: "email",
        normalize: true,
        messages: {
            emailEmpty: "email field must not be empty",
            required: "email is not valid",
            string: "email is not valid",
        },
    },
    password: {
        type: "string",
        min: 4,
        max: 255,
        messages: {
            required: "password is required",
            string: "password is incorrect",
            stringMin: "the password must be at least 4 liters.",
            stringMax: "the password must be less then 255 liters.",
        },
    },
    confirmPassword: {
        type: "string",
        min: 4,
        max: 255,
        messages: {
            required: "password repeat is required",
            string: "password repeat is incorrect.",
            stringMin: "the password repeat must be at least 4 liters.",
            stringMax: "the password repeat must be less then 255 liters.",
        },
    },
   captcha: {
    type: "string",
    min: 4,
    max: 4,
    messages: {
        required: "security code is required",
        stringMin: "security code must be 4 digits",
        stringMax: "security code must be 4 digits"
    }
}
};
