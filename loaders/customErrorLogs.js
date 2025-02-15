const customErrorMessages = {
    statusCode: {
        // Login API
        USER_NOT_AUTHORIZED: 2001,
        PASSWORD_DOES_NOT_MATCH: 2002,
        GET_USER_BY_EMAIL_ERROR: 2003,
        GET_USER_ERROR: 2004,
        UPDATE_USER_ERROR: 2005,
        USER_ACCESS_TOKEN_ERROR: 2006,
        TOKEN_IS_EXPIRED: 2007,
        CREATE_USER_ERROR: 2008,
        TOKEN_ERROR: 2009
    },
    statusMessage: {
        2001: 'USER_NOT_AUTHORIZED',
        2002: 'PASSWORD_DOES_NOT_MATCH',
        2003: 'GET_USER_BY_EMAIL_ERROR',
        2004: 'GET_USER_ERROR',
        2005: 'UPDATE_USER_ERROR',
        2006: 'USER_ACCESS_TOKEN_ERROR',
        2007: 'TOKEN_IS_EXPIRED',
        2008: 'CREATE_USER_ERROR',
        2009: 'TOKEN_ERROR'
    }
};

module.exports = customErrorMessages;
