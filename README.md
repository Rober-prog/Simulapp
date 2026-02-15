# SimulApp - Aplicación para Autoescuelas

## Descripción
SimulApp es una aplicación web diseñada para ayudar a las autoescuelas a gestionar simulacros de exámenes de conducción. Permite registrar alumnos, realizar simulacros, registrar faltas y generar informes.

## Requisitos para la app Android WebView
Para integrar esta aplicación web en una aplicación Android con WebView, se debe implementar una interfaz JavaScript que permita la comunicación entre la app web y la app nativa.

### Interfaz JavaScript necesaria
```java
// En la actividad Android que contiene el WebView
webView.addJavascriptInterface(new WebAppInterface(), "Android");

// Clase de interfaz para comunicación JS-Android
public class WebAppInterface {
    @JavascriptInterface
    public void savePDF(String base64PDF, String filename) {
        // Implementar código para guardar el PDF
        // El PDF viene en formato base64 con prefijo "data:application/pdf;base64,"
    }
    
    @JavascriptInterface
    public void showToast(String message) {
        // Mostrar un toast con el mensaje
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }
}
