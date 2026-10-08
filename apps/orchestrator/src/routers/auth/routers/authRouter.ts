import { router } from '../../../trpc';
import { mfaRouter } from './mfaRouter';
import { oauth2Router } from './oauth2Router';
import { otpRouter } from './otpRouter';
import { passwordRouter } from './passwordRouter';
import { sessionRouter } from './sessionRouter';

/**
 * Main authentication router
 * Combines all authentication mechanism routers
 */
export const authRouter = router({
    password: passwordRouter,
    otp: otpRouter,
    oauth2: oauth2Router,
    mfa: mfaRouter,
    session: sessionRouter,
});
