import React from 'react';
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery';

const galleryData: GalleryItem[] = [
  {
    common: 'Lion',
    binomial: 'Panthera leo',
    photo: {
      url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
      text: 'Majestic lion couple resting peacefully on a brown rock in the African savanna',
      pos: '50% 35%',
      by: 'Clément Roy'
    }
  },
  {
    common: 'Asiatic elephant',
    binomial: 'Elephas maximus',
    photo: {
      url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
      text: 'Herd of Sri Lankan elephants walking away from a refreshing river',
      pos: '65% 50%',
      by: 'Alex Azabache'
    }
  },
  {
    common: 'Red-tailed black cockatoo',
    binomial: 'Calyptorhynchus banksii',
    photo: {
      url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80',
      text: 'Close-up of a stunning exotic cockatoo perched on a forest branch',
      pos: '50% 40%',
      by: 'David Clode'
    }
  },
  {
    common: 'Dromedary',
    binomial: 'Camelus dromedarius',
    photo: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      text: 'Camel and newborn calf journeying peacefully across Sahara desert sand dunes',
      pos: '50% 50%',
      by: 'Moaz Tobok'
    }
  },
  {
    common: 'Polar bear',
    binomial: 'Ursus maritimus',
    photo: {
      url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1200&q=80',
      text: 'Polar bear traversing Arctic sea ice against pristine snow and water',
      pos: '50% 25%',
      by: 'Hans-Jurgen Mager'
    }
  },
  {
    common: 'Giant panda',
    binomial: 'Ailuropoda melanoleuca',
    photo: {
      url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=1200&q=80',
      text: 'Giant panda feeding on bamboo branches high up in a forest tree',
      pos: '50% 40%',
      by: 'Jiachen Lin'
    }
  },
  {
    common: "Grévy's zebra",
    binomial: 'Equus grevyi',
    photo: {
      url: 'https://images.unsplash.com/photo-1526095179574-86e545346ae6?auto=format&fit=crop&w=1200&q=80',
      text: 'Zebra standing on open golden savanna fields looking towards the camera',
      pos: '55% 35%',
      by: 'Jeff Griffith'
    }
  },
  {
    common: 'Cheetah',
    binomial: 'Acinonyx jubatus',
    photo: {
      url: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1200&q=80',
      text: 'Cheetah lying attentive and focused in the savanna grassland under clear blue sky',
      pos: '50% 50%',
      by: 'Mike Bird'
    }
  },
  {
    common: 'King penguin',
    binomial: 'Aptenodytes patagonicus',
    photo: {
      url: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1200&q=80',
      text: 'King penguin with fluffy brown chick standing on coastal Antarctic rocks',
      pos: '50% 35%',
      by: 'Martin Wettstein'
    }
  },
  {
    common: 'Red panda',
    binomial: 'Ailurus fulgens',
    photo: {
      url: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=1200&q=80',
      text: 'Curious red panda climbing along lush mossy tree branches in the forest',
      pos: '50% 45%',
      by: 'Niels Baars'
    }
  }
];

const CircularGalleryDemo = () => {
  return (
    // Outer scroll track providing scrollable height for 3D rotation
    <div className="w-full bg-background text-foreground" style={{ height: '500vh' }}>
      {/* Sticky viewport container centered on screen */}
      <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden">
        <div className="text-center mb-8 absolute top-16 z-10 pointer-events-none">
          <h1 className="text-4xl font-bold tracking-tight">Animal Gallery</h1>
          <p className="text-muted-foreground mt-2">Scroll up & down to rotate the 3D cylindrical gallery</p>
        </div>
        <div className="w-full h-full">
          <CircularGallery items={galleryData} radius={620} autoRotateSpeed={0.02} />
        </div>
      </div>
    </div>
  );
};

export default CircularGalleryDemo;
