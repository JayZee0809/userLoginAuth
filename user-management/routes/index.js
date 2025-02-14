const express = require('express');
const jwtAuthenticate = require('../../app/helpers/jwt-auth.js');
const userManagementController = require('../controllers/userManagementController.js');
const userAuthController = require('../controllers/userAuthController.js');

const router = express.Router();

/**
 * @swagger
 * {
  "components": {
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer"
      },
      "BasicAuth": {
         "type": "http",
        "scheme": "basic"
      }
    }
  }
}
 */

/* User Login */

/**
 * @swagger
 * {
  "/api/login": {
    "post": {
      "summary": "user login",
      "tags": [
        "User Management"
      ],
      "security": [
        {
          "BasicAuth": []
        }
      ],
      
      "responses": {
        "201": {
          "description": "user login",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                 "properties": {
                  "email": {
                    "type": "string",
                    "example": "developer1@oriel.ai"
                  },
                  "login_token": {
                    "type": "string",
                    "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldmVsb3BlcjFAb3JpZWwuYWkiLCJ1c2VyX2lkIjoyLCJpYXQiOjE2OTA4NjI5MDYsImV4cCI6MTY5MDk0OTMwNn0.P53BEK3mA2Jz4sgxPVm5jVIEV49DSdm9Pmf_AR9dE4c"
                  },
                  "user_id": {
                    "type": "integer",
                    "example": "2"
                  },
                  "user_name": {
                    "type": "string",
                    "example": "developer1"
                  }
                 }
              }
            }
          }
        },
        "401": {
          "description": "Failed to login. Please try again"
        },
        "500": {
          "description": "server error"
        }
      }
    }
  }
}
 */

router.post('/login', userAuthController.postLogin);

/**
 * @swagger
 * {
  "/api/logout": {
    "post": {
      "summary": "admin logout",
      "tags": [
        "User Management"
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "email": {
                  "type": "string",
                  "example": "admin1@oriel.ai"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "content": {
            "application/json": {
              "schema": {
                "type": "string",
                "example": "User with admin1@oriel.ai has been logged out successfully."
              }
            }
          }
        },
        "401": {
          "description": "Failed to logout. Please try again"
        },
        "500": {
          "description": "server error"
        }
      }
    }
  }
}
 */

router.post('/logout', jwtAuthenticate, userAuthController.postLogout);

// User Management

/**
 * @swagger
 * {
  "/api/create-admin": {
    "post": {
      "summary": "create-admin",
      "tags": [
        "User Management"
      ],
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "example": "user8"
                },
                "email": {
                  "type": "string",
                  "example": "user8@gmail.com"
                },
                "password": {
                   "type": "string",
                  "example": "123123123@a"
                },
                "role": {
                  "type": "string",
                  "example": "admin"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "creates the admin/super admin",
          "content": {
            "application/json": {
              "schema": {
                "type": "string",
                "example": "admin Account has been created succesfully created"
              }
            }
          }
        },
        "401": {
          "description": "Failed to create the admin/super admin. Please try again"
        },
        "500": {
          "description": "server error"
        }
      }
    }
  }
}
 */

router.post('/create-user', userManagementController.createUser);

/**
 * @swagger
 * {
  "/api/get-admin": {
    "post": {
      "summary": "get-admin",
      "tags": [
        "User Management"
      ],
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "user_id": {
                  "type": "integer",
                  "example": "3"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "fetches the admin/super admin details",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_id": {
                    "type": "string",
                    "example": "OR-0003"
                  },
                  "name": {
                    "type": "string",
                    "example": "developer2"
                  },
                  "email": {
                    "type": "string",
                    "example": "developer2@oriel.ai"
                  },
                  "password": {
                    "type": "string",
                    "example": "**************"
                  },
                  "role": {
                    "type": "string",
                    "example": "Super Admin"
                  }
                }
              }
            }
          }
        },
        "401": {
          "description": "Failed to fetch the admin/super admin details. Please try again"
        },
        "500": {
          "description": "server error"
        }
      }
    }
  }
}
 */

router.post('/search-user', jwtAuthenticate, userManagementController.getUserByEmailOrUsername);

module.exports = router;