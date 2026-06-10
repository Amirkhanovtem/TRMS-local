import { DragOrderModel } from '@common-drag-order-modal-models/drag-order.model';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { RoomModel } from '@room-models/room.model';

export class TimetableDisplayRoomModel extends DragOrderModel {
  public room: RoomModel;
  public status: StandardEnumModel;
}
