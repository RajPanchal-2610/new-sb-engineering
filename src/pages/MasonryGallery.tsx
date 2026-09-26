import Masonry from 'react-masonry-css';


const breakpointColumnsObj = {
  default: 3,
  1024: 2,
  640: 2
};

interface MasonryGalleryProps {
  images: string[];
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({ images }) => (
  <Masonry
    breakpointCols={breakpointColumnsObj}
    className="flex gap-4"
    columnClassName="masonry-column"
  >
    {images.map((src: string, idx: number) => (
      <img
        key={idx}
        src={src}
        alt={`Place ${idx + 1}`}
        className="mb-4 w-full rounded-xl shadow-lg object-cover hover:scale-105 transition-transform duration-300"
      />
    ))}
  </Masonry>
);

  
export default MasonryGallery;
