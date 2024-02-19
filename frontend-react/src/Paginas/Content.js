import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import Navigator from './Navigator';

function Content({ dato, miFuncionEnPaperbase }) {

  const [mediaItems, setMediaItems] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dato === "SIIII" ? 'http://localhost:80/data' : 'http://localhost:80/eliminado');
        if (response.ok) {
          const responseData = await response.json();
          setMediaItems(responseData);
        } else {
          console.error('Error al obtener datos del servidor:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener datos del servidor:', error);
      }
    };
    fetchData();
  }, [dato]);

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const openVideoInNewTab = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  const eliminarFoto = async (media) => {
    try {
      const response = await fetch(`http://localhost:80/eliminar-foto/${media.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const responseData = await response.json();
        setConfirmDeleteDialogOpen(false);
        setMediaItems(responseData);
      } else {
        console.error('Error al eliminar la foto:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar la foto:', error);
    }
  };

  const handleConfirmDelete = () => {
    if (mediaToDelete) {
      eliminarFoto(mediaToDelete);
    }
  };

  return (
    <div>
      {mediaItems.length > 0 ? (
        <div>
          <Grid container spacing={2}>
            {mediaItems.map((media, index) => (
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
                      backgroundColor: 'blue',
                      cursor: 'pointer',
                    }}
                    image={media.baseUrl}
                    onClick={() => {
                      if (media.mimeType && media.mimeType.startsWith('image')) {
                        handleMediaClick(media);
                      } else if (media.mimeType && media.mimeType.startsWith('video')) {
                        openVideoInNewTab(media.productUrl);
                      }
                    }}
                  />

                  <CardActions sx={{ backgroundColor: '#eaeff1' }}>
                    {dato === "SIIII" && ( 
                      <Button size="small" onClick={() => {
                        setMediaToDelete(media);
                        setConfirmDeleteDialogOpen(true);
                      }}>Eliminar</Button>
                    )} 
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogContent>
              {selectedMedia && selectedMedia.mimeType && selectedMedia.mimeType.startsWith('image') ? (
                <img src={selectedMedia.baseUrl} alt="FullScreen" style={{ width: '100%', height: 'auto' }} />
              ) : null}
            </DialogContent>
          </Dialog>

         
          <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
            <DialogContent>
              <p>¿Estás seguro de que deseas eliminar esta foto?</p>
              <Button onClick={handleConfirmDelete}>Sí</Button>
              <Button onClick={() => setConfirmDeleteDialogOpen(false)}>No</Button>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <p>No hay medios para mostrar.</p>
      )}
      <Navigator data={mediaItems} miFuncionEnPaperbase={miFuncionEnPaperbase} />
    </div>
  );
}

export default Content;
