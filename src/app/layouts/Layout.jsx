const Layout = ({ threeScene, ui }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateAreas: '"threeScene"',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <div style={{ gridArea: 'threeScene' }}>
        {threeScene}
      </div>
      <div style={{
        gridArea: 'threeScene',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          {ui}
        </div>
      </div>
    </div>
  );
};

export default Layout;
