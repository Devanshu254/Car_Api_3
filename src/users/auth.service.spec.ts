import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { hash } from "crypto";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', ()=>{
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    beforeEach(async () => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
        };
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    }) 

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signup('asdf@asdf.com', 'asdf');
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () =>
     
          Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
      });

      it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
      });

      it('throws if signin is called with an unused email', async () => {
        await expect(
            service.signin('asdflkj@asdlfkj.com', 'passdflkj')
        ).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        // Mock the find method to return a user with a specific email and password
        fakeUsersService.find = () => Promise.resolve([{ email: 'asdf@asdf.com', password: 'asdf' } as User]);
    
        // Assert that the signin method throws an error when given incorrect password
        await expect(service.signin('asdf@asdf.com', 'wrongpassword')).rejects.toThrow(BadRequestException);
    });
    
    it('returns a user if the correct password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([{ email: 'asdf@asdf.com', password: 'a31bf8c3197ac65e.639e86c8776adb323a7afd04733fa6ccf18235c1480d61ecd75bf10c02563e90' } as User]);
        const user = await service.signin('asdf@asdf.com', 'asdf');
        expect(user).toBeDefined();
    });
});

