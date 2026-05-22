import SimpleBarScroll from '@/components/SimpleBarScroll.tsx';
import Navigation from '@/layouts/sidebar/navigation/navigation.tsx';

const SidebarContent = ({ selectedItems, setSelectedItems }: { selectedItems: any; setSelectedItems: (items: any) => void }) => {
  return (
    <SimpleBarScroll style={{ height: 'calc(100vh - 74px)' }}>
      <Navigation selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
    </SimpleBarScroll>);
};

export default SidebarContent;
