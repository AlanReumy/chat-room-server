import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryDto } from './dto/history.dto';

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(chatroomId: number) {
    const history = await this.prismaService.chatHistory.findMany({
      where: {
        chatroomId
      }
    });

    const res = [];
    for (let i = 0; i < history.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: history[i].senderId
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
          createTime: true,
          headPic: true
        }
      });
      res.push({
        ...history[i],
        sender: user
      });
    }
    return res;
  }

  async add(chatroomId: number, history: HistoryDto) {
    return this.prismaService.chatHistory.create({
      data: history
    });
  }
}
