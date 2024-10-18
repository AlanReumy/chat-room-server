import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendAddDto } from './dto/friend-add.dto';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(friendAddDto: FriendAddDto, userId: number) {
    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: friendAddDto.friendId,
        reason: friendAddDto.reason,
        status: 0
      }
    })
  }

  async list(userId: number) {
    return this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId
      }
    })
  }

  async agree(friendId: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0
      },
      data: {
        status: 1
      }
    })

    const res = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId
      }
    })

    if (!res.length) {
      await this.prismaService.friendship.create({
        data: {
          userId,
          friendId
        }
      })
    }
    return '添加成功'
  }

  async reject(friendId: number, userId: number) {
    const res = await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0
      },
      data: {
        status: 2
      }
    })
    if (res.count === 0) {
      return '没有找到该好友申请'
    }
    return '已拒绝'
  }

  async getFriendship(userId: number) {
    const friends = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          {
            userId: userId
          },
          {
            friendId: userId
          }
        ]
      }
    });

    const set = new Set<number>();
    for (let i = 0; i < friends.length; i++) {
      set.add(friends[i].userId)
      set.add(friends[i].friendId)
    }

    const friendIds = [...set].filter(item => item !== userId);

    const res = [];

    for (let i = 0; i < friendIds.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: friendIds[i],
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true
        }
      })
      res.push(user)
    }

    return res
  }

  async remove(friendId: number, userId: number) {
    await this.prismaService.friendship.deleteMany({
      where: {
        userId,
        friendId,
      }
    })
    return '删除成功';
  }


}
