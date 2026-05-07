import mongoose, { Schema, Model } from 'mongoose';

export interface IMenu {
  name: string;
  icon: string;
  path: string;
  parentId: mongoose.Types.ObjectId | null;
  permission: string;
  sort: number;
  type: 'menu' | 'button';
  status: 'visible' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema = new Schema<IMenu>(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      default: null,
    },
    permission: {
      type: String,
      default: '',
    },
    sort: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['menu', 'button'],
      default: 'menu',
    },
    status: {
      type: String,
      enum: ['visible', 'hidden'],
      default: 'visible',
    },
  },
  {
    timestamps: true,
  }
);

menuSchema.index({ parentId: 1 });
menuSchema.index({ permission: 1 });

const Menu: Model<IMenu> =
  mongoose.models.Menu || mongoose.model<IMenu>('Menu', menuSchema);

export default Menu;
