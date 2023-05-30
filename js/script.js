let mediaRecorder; // Variável para armazenar o objeto MediaRecorder
      let recordedChunks = []; // Array para armazenar os chunks de vídeo capturados

      // Captura a tela do usuário
      function captureScreen() {
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then((stream) => {
            const videoElement = document.createElement("video");
            videoElement.srcObject = stream;
            videoElement.autoplay = true;

            // Adicione o elemento de vídeo à página
            document.body.appendChild(videoElement);

            // Inicializa o MediaRecorder para gravar a captura de tela
            mediaRecorder = new MediaRecorder(stream);

            // Evento para adicionar cada chunk de vídeo ao array
            mediaRecorder.addEventListener("dataavailable", (event) => {
              if (event.data.size > 0) {
                recordedChunks.push(event.data);
              }
            });

            // Evento para parar a captura de tela e salvar o vídeo
            document
              .getElementById("stopButton")
              .addEventListener("click", () => {
                mediaRecorder.stop();
              });

            // Evento para salvar o vídeo no computador
            document
              .getElementById("saveButton")
              .addEventListener("click", () => {
                const blob = new Blob(recordedChunks, { type: "video/mp4" });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "captured_screen.mp4";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                recordedChunks = []; // Limpa os chunks gravados para uma nova captura
              });

            // Inicia a gravação da captura de tela
            mediaRecorder.start();
          })
          .catch((error) => {
            console.error("Erro ao capturar a tela:", error);
          });
      }

      // Chame a função para capturar a tela quando o botão for clicado
      document
        .getElementById("captureButton")
        .addEventListener("click", captureScreen);