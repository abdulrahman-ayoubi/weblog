exports.editProfileSchema = {
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
            required: "new password is required",
            string: "new password is incorrect",
            stringMin: "the new password must be at least 4 liters.",
            stringMax: "the new password must be less then 255 liters.",
        },
    },
    confirmPassword: {
        type: "string",
        min: 4,
        max: 255,
        messages: {
            required: "repeat new password repeat is required",
            string: "repeat new password repeat is incorrect.",
            stringMin: "the repeat new password repeat must be at least 4 liters.",
            stringMax: "the repeat new password repeat must be less then 255 liters.",
        },
    },
};
