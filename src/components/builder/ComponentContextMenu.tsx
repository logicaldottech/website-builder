import React from 'react';
import { Menu, Item, Separator } from 'react-contexify';
import { Trash2, Copy } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const CONTEXT_MENU_ID = 'component-context-menu';

const ComponentContextMenu: React.FC = () => {
  const { deleteComponent, duplicateComponent } = useBuilderStore();

  const handleItemClick = ({ id, props }: any) => {
    const componentId = props?.id;
    if (!componentId) return;

    switch (id) {
      case 'delete':
        deleteComponent(componentId);
        break;
      case 'duplicate':
        duplicateComponent(componentId);
        break;
      default:
        break;
    }
  };

  return (
    <Menu id={CONTEXT_MENU_ID} theme="dark" animation="fade">
      <Item id="duplicate" onClick={handleItemClick}>
        <div className="flex items-center gap-2">
          <Copy size={16} />
          <span>Duplicate</span>
        </div>
      </Item>
      <Separator />
      <Item id="delete" onClick={handleItemClick}>
        <div className="flex items-center gap-2 text-red-400">
          <Trash2 size={16} />
          <span>Delete</span>
        </div>
      </Item>
    </Menu>
  );
};

export default ComponentContextMenu;
