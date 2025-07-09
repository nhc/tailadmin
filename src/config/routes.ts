export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    //SIGN_UP: "/auth/signup",
    SIGN_UP_VIBER: "/auth/signup?type=Viber",
    SIGN_UP_CODER: "/auth/signup?type=Coder",
    FORGOT_PASSWORD: "/auth/forgot-password",
    UPDATE_PASSWORD: "/auth/update-password",
    CALLBACK: "/auth/callback",
    ERROR: "/auth/error",
    SIGN_UP_SUCCESS: "/auth/sign-up-success",
    CONFIRM: "/auth/confirm",
    EMAIL_CONFIRM: "/auth/confirm",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
  },
  PAGES: {
    HOW_IT_WORKS: "/how-it-works",
    ABOUT_US: "/about-us",
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
export type AuthRouteKey = keyof typeof ROUTES.AUTH;
