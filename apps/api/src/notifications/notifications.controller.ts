import { Controller, Get, Patch, Param, Req } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { RequestWithUser } from '../common/guards/roles.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(@Req() req: RequestWithUser) {
    return this.notificationService.findAllByUser(req.user.sub);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.notificationService.markAsRead(id, req.user.sub);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: RequestWithUser) {
    return this.notificationService.markAllAsRead(req.user.sub);
  }
}
