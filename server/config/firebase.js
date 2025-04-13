const admin = require("firebase-admin");
require("dotenv").config();

// Replace \\n with an actual newline character in the private key
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCx/2wTU2C8M44a\nuiJ0Vxf9awwk0ga8w4XHYJ39kXmxA8wIfCo39WMItppODt99A+Hj/z4ErSJDm+rK\nAETU8CAvsfOF27hNxlW+jMBAiJyDFXrNW8sRkvwI9b50bwUdvKWvp3joivxaWKvK\nt0ciiQE1ntsQeiyOGZsOakH3x4eS8dj9Ez60Av1IMYQlHkKvrtb+5AJoAbY9eS4c\njjjCG1Zq0h9iBTM6gXmSMtyZC63O1S79KWmb7zKqhvp2eeDEUNDfsyCeJfXjz7X6\nrkIwC9z4xM9M9palNHLAcdydnTgVPSLsi+kkCRqQJV9DuaBSUL8bExpWulzTj13j\nohkve4YlAgMBAAECggEACbmOBs9Gc3nbRiAMcQVEy6/CdyzcuTRIgJW0Lrijk1WF\nBfinWNfTYZQ9Fs3ZYtaTC/ZzxbnM1ltJfGBVN7oSfsXu62MPV9EhzvpDKF4eXktj\n4nOPrcXf9xWwDQ33aQIXyPfyKJMBXxFFpNrBwZlbziQVTWTovsRs3uB/eqwK1ERt\nToc44aOz0yN0DpKp7BDrFk0XRLd0nAhnUotGTOKYwiG6mZVl/Kw/tIlCI5usea6u\nZNCA19hlTZ93EwpuLPyn1LfCI/kpOnrFcZ+Ts5RL0IRk5DVNe7VW/UN3BrEjC/YR\nNIAFP5Izv7ZZ9AAGyqzSIP9IC7CNEqoGx4H1R2qIGQKBgQD2TjhpJpuZARQw2hvv\nT2QyNovs525GKe2FwhDnTM8+8lZV1348sThMa9aNWWoMV7mePXQc+kRJlIvdLufe\nsXqjhDQ9MWDXaw3IoKKt2sJf4JVhnMj/98rT4eSBGfuje6QXWflPHpFI5CHL+0z+\n4387ilFR5jdewsHJE55FXg+jvQKBgQC5AO5V3nyxv/pOyvRfTLZ/WawbBXFK7Dcn\nI4gJNI1pXBmqT3obQC5zhiIQHVUQTStrm0s/GwpCNg7MMKAhj9fE4sp275TcuGzm\nMRUC+yXRwowMDtyTNwhY2Uncmiu4Cx7beWncTFlC1ukpz+BYVj7K9kVXAAXFXwf/\nh+lRQAveiQKBgQDedKFAXy1TUIUi5isqxeKx81AHhLK1TjMHhtJrhZT8vjU5zKpo\nOIunghJCkcpVIXo1MD3J2kOIzVBRUYb8PAGO492mkw1rInZNiL/FE/pQS++/PLLR\ndMTM/425CHWdHxOCP7ILQolncxwPNoZBA8mrRe7ScIH75RzO9hgRgLXRZQKBgEWe\n8xI/ix99Rp5WREaE4Pzl6x20G6F9aXgCKBSGwVzP+xybkjElIxX4eWMlFrjuwZNa\nOqQB8gdevozbE7ftoN6IFndRy+yQPvMVr3mSt/XLR9bV1O5VvH9rLh+lqSQ2kyM2\n+r6bwM+lftNsVloIAtNwgEGwUXuoOqNQK16XQqA5AoGBAL6JtypiNOvPB3Ikr0it\nQCi67nqa11Gi/J+KdCatkrK/kD8hBZRRzPIVCe+kqBF6g1SBNAkg8rqYDPsdgnj2\nez021zguBWKyC6t0WGrI7+I/JX6C6cqmJ6GoXd6662pCSBAx7tq66d/RJBNUNjvu\ntbEFQAJj8rkblxpGuNNJj5y0\n-----END PRIVATE KEY-----\n" // Make sure it correctly replaces \\n`,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
