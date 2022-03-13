export const GAME_BOX = {
  top: 1,
  left: 'center',
  width: '100%',
  height: '100%-1',
  content: ' ',
  tags: true,
  style: {
    fg: 'white',
    bg: '#000',
    hover: {
      bg: '#000',
    },
  },
} as const;

export const SCREEN = {
  smartCSR: true,
};

export const FLASH_BOX = {
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  content: ' ',
  tags: true,
  style: {
    fg: 'white',
    bg: 'white',
    hover: {
      bg: 'white',
    },
  },
};

export const NEW_BOX = ({ x, y, color }: { x: number; y: number; color: 'green' | 'red' }) => ({
  top: y,
  left: x,
  width: 1,
  height: 1,
  content: ' ',
  tags: true,
  style: {
    fg: 'white',
    bg: color,
    hover: {
      bg: color,
    },
  },
});
