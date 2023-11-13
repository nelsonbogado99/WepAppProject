import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

function Content() {
  const [rawData, setRawData] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');

    if (dataParam) {
      setRawData(dataParam);
    }
  }, []);

  useEffect(() => {
    try {
      const data = JSON.parse(rawData);
      if (Array.isArray(data)) {
        setImageUrls(data);
      }
    } catch (error) {
      console.error('Error al analizar datos en bruto:', error);
    }
  }, [rawData]);

  const handleImageClick = (url) => {
    setSelectedImageUrl(url);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {imageUrls.length > 0 ? (
        <div>
          <Grid container spacing={2}>
            {imageUrls.map((url, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      pt: '75%',
                      backgroundColor: 'blue', // Cambia el color de fondo aquí
                      cursor: 'pointer', // Cambia el cursor al pasar sobre la imagen
                    }}
                    image={url}
                    onClick={() => handleImageClick(url)}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Contenido de la tarjeta
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ backgroundColor: '#eaeff1' }}>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Diálogo para mostrar la imagen en pantalla completa */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogContent>
              <img src={selectedImageUrl} alt="FullScreen" style={{ width: '100%', height: 'auto' }} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <p>No hay imágenes para mostrar.</p>
      )}
    </div>
  );
}

export default Content;