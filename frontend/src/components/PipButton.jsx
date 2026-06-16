export default function PipButton({ videoRef }) {
  const requestPiP = async () => {
    try {
      if (videoRef.current?.webkitSetPresentationMode) {
        videoRef.current.webkitSetPresentationMode('picture-in-picture');
      } else if (videoRef.current?.requestPictureInPicture) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.log('PiP não suportado:', err);
    }
  };

  return (
    <button onClick={requestPiP} className="control-btn" title="Picture-in-Picture">
      📌
    </button>
  );
}
