/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { ExecutionContext, createParamDecorator, UnauthorizedException } from '@nestjs/common';

export interface CurrentUser{
    id: string;
    email: string;
    email_verified: boolean;
    firstname: string;
    lastname: string;
    phone: string;
    phone_verified: boolean;
    role: string;
    sub: string;
    username: string;
}
export const User = createParamDecorator((data: keyof CurrentUser | undefined, ctx: ExecutionContext) : CurrentUser | any => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user.user_metadata as CurrentUser;
    user.id = user.sub;
    
    // console.log('User in decorator:', user);

    if(!user)
    {
        throw new UnauthorizedException('User not authenticated')
    }

    if(data)
    {
        if(!user.hasOwnProperty(data))
            throw new Error(`Property ${data} does not exist on User object`);

        if(data === 'sub' || data === 'id'){
            return user.sub;
        }
        return user[data]
    }

    return user;
});