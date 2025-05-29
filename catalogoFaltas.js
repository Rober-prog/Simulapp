// CATALOGO DE FALTAS - Updated with correct exports and fixed typos
const FALTAS_PREDETERMINADAS = [
    { id: 'l1', codigo: '1.1', descripcion: 'Comprobaciones generales', tipo: 'leve'},
    { id: 'l2', codigo: '1.2', descripcion: 'Comprobaciones específicas ', tipo: 'leve'},
    { id: 'l3', codigo: '2.1', descripcion: 'Asiento no reglado', tipo: 'leve'},
    { id: 'l4', codigo: '2.2', descripcion: 'Espejos retrovisores no reglados', tipo: 'leve'},
    { id: 'l5', codigo: '2.3', descripcion: 'Cinturón de seguridad', tipo: 'leve'},
    { id: 'l6', codigo: '2.4', descripcion: 'Casco', tipo: 'leve'},
    { id: 'l7', codigo: '2.5', descripcion: 'Tacógrafo', tipo: 'leve'},
    { id: 'l8', codigo: '2.6', descripcion: 'Otros sistemas de seguridad', tipo: 'leve'},
    { id: 'l9', codigo: '3.1', descripcion: 'Incorporarse sin observar', tipo: 'leve'},
    { id: 'l10', codigo: '3.2', descripcion: 'Incorporarse sin señalizar', tipo: 'leve'},
    { id: 'l11', codigo: '3.2', descripcion: 'Icorprorarse señalizando sin antelación', tipo: 'leve'},
    { id: 'l12', codigo: '3.3', descripcion: 'No incorporarse a tiempo según tráfico', tipo: 'leve'},
    { id: 'l13', codigo: '3.3', descripcion: 'Uso inadecuado de carril de aceleración', tipo: 'leve'},
    { id: 'l14', codigo: '4.1', descripcion: 'No usar carril derecho', tipo: 'leve'},
    { id: 'l15', codigo: '4.1', descripcion: 'Circular junto al eje en doble sentido', tipo: 'leve'},
    { id: 'l16', codigo: '4.1', descripcion: 'No circular junto al borde derecho con mala visibilidad', tipo: 'leve'},
    { id: 'l17', codigo: '4.1', descripcion: 'Circular por el arcén', tipo: 'leve'},
    { id: 'l18', codigo: '4.4', descripcion: 'Velocidad anormalmente reducida', tipo: 'leve'},
    { id: 'l19', codigo: '4.4', descripcion: 'No moderar velocidad ante la presencia de peatones', tipo: 'leve'},
    { id: 'l20', codigo: '4.4', descripcion: 'Reducir velocidad antes de carril de decerelación', tipo: 'leve'},
    { id: 'l21', codigo: '4.4', descripcion: 'Detenerse innecesariamente', tipo: 'leve'},
    { id: 'l22', codigo: '4.5', descripcion: 'Exceder velocidad genérica en +10km/h', tipo: 'leve'},
    { id: 'l23', codigo: '4.6', descripcion: 'Detenerse detrás de obstáculo o vehículo', tipo: 'leve'},
    { id: 'l24', codigo: '4.6', descripcion: 'Reducir considerablemente la velocidad sin valorar', tipo: 'leve'},
    { id: 'l25', codigo: '5.1', descripcion: 'Desplazarse sin observar', tipo: 'leve'},
    { id: 'l26', codigo: '5.2', descripcion: 'Desplazarse sin señalizar', tipo: 'leve'},
    { id: 'l27', codigo: '5.2', descripcion: 'Desplazarse señalizando sin antelación', tipo: 'leve'},
    { id: 'l28', codigo: '5.2', descripcion: 'Señalizar con excesiva antelación', tipo: 'leve'},
    { id: 'l29', codigo: '5.3', descripcion: 'Desplazarse de forma brusca', tipo: 'leve'},
    { id: 'l30', codigo: '5.3', descripcion: 'No penetrar cuánto antes en carril de deceleración', tipo: 'leve'},
    { id: 'l31', codigo: '6.1', descripcion: 'Adelantar desde demasiado lejos al que precede', tipo: 'leve'},
    { id: 'l32', codigo: '6.2', descripcion: 'Adelantar con lentitud', tipo: 'leve'},
    { id: 'l33', codigo: '6.3', descripcion: 'Adelantar a vehículos de +2 ruedas en cruces sin prioridad', tipo: 'leve'},
    { id: 'l34', codigo: '6.3', descripcion: 'Adelantar en pasos para ciclistas o pasos para peatones', tipo: 'leve'},
    { id: 'l35', codigo: '6.3', descripcion: 'Doble adelantamiento invadiendo sentido contrario', tipo: 'leve'},
    { id: 'l36', codigo: '6.4.1', descripcion: 'Adelantar sin observar', tipo: 'leve'},
    { id: 'l37', codigo: '6.4.2', descripcion: 'Adelantar sin indicar', tipo: 'leve'},
    { id: 'l38', codigo: '6.4.2', descripcion: 'Adelantar indicando sin antelación', tipo: 'leve'},  
    { id: 'l39', codigo: '6.4.3', descripcion: 'Demorar la vuelta al carril derecho', tipo: 'leve'},
    { id: 'l40', codigo: '6.5', descripcion: 'No ceñirse al borde derecho siendo adelantado', tipo: 'leve'},
    { id: 'l41', codigo: '6.6', descripcion: 'Adelantar por la derecha', tipo: 'leve'},
    { id: 'l42', codigo: '7.1', descripcion: 'Preguntar la dirección a seguir', tipo: 'leve'},
    { id: 'l43', codigo: '7.1', descripcion: 'Cambiar de dirección sin observar', tipo: 'leve'},
    { id: 'l44', codigo: '7.2', descripcion: 'Cambiar de dirección sin indicar', tipo: 'leve'},
    { id: 'l45', codigo: '7.2', descripcion: 'Cambiar de dirección indicando sin antelación', tipo: 'leve'},
    { id: 'l46', codigo: '7.3', descripcion: 'Posición no adecuada en franqueo de cruce', tipo: 'leve'},
    { id: 'l47', codigo: '7.4', descripcion: 'Velocidad excesivamente reducida en franqueo de cruce', tipo: 'leve'},
    { id: 'l48', codigo: '7.4', descripcion: 'Velocidad inadecuada para las condiciones del cruce', tipo: 'leve'},
    { id: 'l49', codigo: '7.5', descripcion: 'Detención súbita por falta de anticipación', tipo: 'leve'},
    { id: 'l50', codigo: '7.5', descripcion: 'Detención sin alzancar el punto de visibilidad', tipo: 'leve'},
    { id: 'l51', codigo: '7.5', descripcion: 'Detenerse en cruce sin necesidad', tipo: 'leve'},
    { id: 'l52', codigo: '7.5', descripcion: 'Detenerse rebasando posición de entrada', tipo: 'leve'},
    { id: 'l53', codigo: '7.6', descripcion: 'No reanudar a tiempo', tipo: 'leve'},
    { id: 'l54', codigo: '8.1', descripcion: 'Cambiar de sentido sin observar', tipo: 'leve'},
    { id: 'l55', codigo: '8.2', descripcion: 'Cambiar de sentido sin indicar', tipo: 'leve'},
    { id: 'l56', codigo: '8.2', descripcion: 'Cambiar de sentido indicando sin antelación', tipo: 'leve'},
    { id: 'l57', codigo: '8.3', descripcion: 'Cambiar de sentido estando prohibido por norma', tipo: 'leve'},
    { id: 'l58', codigo: '7.2', descripcion: 'Cambiar de dirección sin indicar', tipo: 'leve'},
    { id: 'l59', codigo: '7.2', descripcion: 'Cambiar de dirección indicando sin antelación', tipo: 'leve'},
    { id: 'l60', codigo: '8.4', descripcion: 'Cambiar de sentido con +1 movimientos innecesarios', tipo: 'leve'},
    { id: 'l61', codigo: '8.4', descripcion: 'Cambiar de sentido golpeando el bordillo sin subir', tipo: 'leve'},
    { id: 'l62', codigo: '9.1', descripcion: 'Parar/estacionar sin observar', tipo: 'leve'},
    { id: 'l63', codigo: '9.2', descripcion: 'Parar/estacionar sin indicar', tipo: 'leve'},
    { id: 'l64', codigo: '9.2', descripcion: 'Parar/estacionar indicando sin antelación', tipo: 'leve'},
    { id: 'l65', codigo: '9.2', descripcion: 'Parar/estacionar indicando con demasiada antelación', tipo: 'leve'},
    { id: 'l66', codigo: '9.3', descripcion: 'Parar/estacionar en lugar prohibido por norma', tipo: 'leve'},
    { id: 'l67', codigo: '9.3', descripcion: 'Parar/estacionar en lugar claramente inferior, entrando parte posterior', tipo: 'leve'},
    { id: 'l68', codigo: '9.4', descripcion: 'Estacionar sin aprovechar espacio', tipo: 'leve'},
    { id: 'l69', codigo: '9.4', descripcion: 'Estacionar golpeando el bordillo sin subir', tipo: 'leve'},
    { id: 'l70', codigo: '9.4', descripcion: 'No poner freno de estacionamiento', tipo: 'leve'},
    { id: 'l71', codigo: '9.4', descripcion: 'No apagar el motor al estacionar', tipo: 'leve'},
    { id: 'l72', codigo: '9.4', descripcion: 'Abrir la puerta sin observar', tipo: 'leve'},
    { id: 'l73', codigo: '11.1', descripcion: 'Detenerse o no reanudar cuando el agente da paso', tipo: 'leve'},
    { id: 'l74', codigo: '11.2', descripcion: 'Rebasar barrera móvil sin causar peligro', tipo: 'leve'},
    { id: 'l75', codigo: '11.3', descripcion: 'Detenerse o no reanudar con semáforo con franja blanca vertical', tipo: 'leve'},
    { id: 'l76', codigo: '11.3', descripcion: 'Detenerse o no reanudar con semáforo verde o amarillo intermitente', tipo: 'leve'},
    { id: 'l77', codigo: '11.3', descripcion: 'No moderar velocidad con semáforo amarillo intermitente', tipo: 'leve'},
    { id: 'l78', codigo: '11.4', descripcion: 'Exceder velocidad específica en +10km/h', tipo: 'leve'},
    { id: 'l79', codigo: '11.4', descripcion: 'Incumplir señal de SEÑALES ACÚSTICAS PROHIBIDAS', tipo: 'leve'},
    { id: 'l80', codigo: '11.4', descripcion: 'No seguir dirección indicada por no observar señal de orientación', tipo: 'leve'},
    { id: 'l81', codigo: '11.5.1', descripcion: 'Circular sobre líneas discontínuas', tipo: 'leve'},
    { id: 'l82', codigo: '11.5.2', descripcion: 'Detenerse sin justificación sobre pasos de peatones o ciclistas', tipo: 'leve'},
    { id: 'l83', codigo: '11.5.2', descripcion: 'Rebasar línea de detención', tipo: 'leve'},
    { id: 'l84', codigo: '11.5.4', descripcion: 'Detenerse sobre cuadrícula amarilla', tipo: 'leve'},
    { id: 'l85', codigo: '12.2', descripcion: 'No usar alumbrado de posición siendo obligatorio', tipo: 'leve'},
    { id: 'l86', codigo: '12.3', descripcion: 'No usar alumbrado de cruce siendo obligatorio', tipo: 'leve'},
    { id: 'l87', codigo: '12.4', descripcion: 'No usar alumbrado de carretera siendo obligatorio', tipo: 'leve'},
    { id: 'l88', codigo: '12.5', descripcion: 'Usar luz antiniebla trasera sin las condiciones para ello', tipo: 'leve'},
    { id: 'l89', codigo: '12.6', descripcion: 'No usar luz de emergencia siendo obligatorio', tipo: 'leve'},
    { id: 'l90', codigo: '12.6', descripcion: 'Usar luz de emergencia sin las condiciones para ello', tipo: 'leve'},
    { id: 'l91', codigo: '13.1.1', descripcion: 'No conseguir arrancar el motor', tipo: 'leve'},
    { id: 'l92', codigo: '13.1.1', descripcion: 'Arrancar el motor con marcha puesta dando salto', tipo: 'leve'},
    { id: 'l93', codigo: '13.1.1', descripcion: 'Insistir en arrancar el motor cuando ya está en marcha', tipo: 'leve'},
    { id: 'l94', codigo: '13.1.1', descripcion: 'No apagar el motor cuando sea necesario', tipo: 'leve'},
    { id: 'l95', codigo: '13.1.2', descripcion: 'Pisar embrague sin justificación', tipo: 'leve'},
    { id: 'l96', codigo: '13.1.3', descripcion: 'Disminuir velocidad bruscamente por no frenar de forma progresiva', tipo: 'leve'},
    { id: 'l97', codigo: '13.1.4', descripcion: 'No acelerar de forma progresiva, suave y con decisión', tipo: 'leve'},
    { id: 'l98', codigo: '13.1.5', descripcion: 'No usar relación de marchas adecuada', tipo: 'leve'},
    { id: 'l99', codigo: '13.1.5', descripcion: 'Poner punto muerto antes de detenerse', tipo: 'leve'},
    { id: 'l100', codigo: '13.1.5', descripcion: 'No usar freno motor en descensos', tipo: 'leve'},
    { id: 'l101', codigo: '13.1.5', descripcion: 'Calado del motor por marcha no adecuada', tipo: 'leve'},
    { id: 'l102', codigo: '13.1.6', descripcion: 'No desactivar el freno de estacionamiento', tipo: 'leve'},
    { id: 'l103', codigo: '13.1.7', descripcion: 'Sujetar el volante con una mano', tipo: 'leve'},
    { id: 'l104', codigo: '13.1.7', descripcion: 'Ligeras desviaciones con dos manos o al cambiar de marcha', tipo: 'leve'},
    { id: 'l105', codigo: '13.1.7', descripcion: 'Giro brusco del volante por no percibir la trayectoria de la vía', tipo: 'leve'},
    { id: 'l106', codigo: '13.1.7', descripcion: 'Mantener las manos cruzadas al volante o sujetarlo por el interior', tipo: 'leve'},
    { id: 'l107', codigo: '13.1.8', descripcion: 'No realizar una conducción eficiente', tipo: 'leve'},
    { id: 'l108', codigo: '13.2.1', descripcion: 'Usar el embrague antes que el freno sin necesidad', tipo: 'leve'},
    { id: 'l109', codigo: '13.2.1', descripcion: 'Calado del motor', tipo: 'leve'},
    { id: 'l110', codigo: '13.2.1', descripcion: 'Acelerar en vacío', tipo: 'leve'},
    { id: 'l111', codigo: '13.2.2', descripcion: 'Arranque brusco o a saltos', tipo: 'leve'},
    { id: 'l112', codigo: '13.2.3', descripcion: 'Cambiar de marcha con brusquedad', tipo: 'leve'},
    { id: 'l113', codigo: '13.2.3', descripcion: 'Rascar marcha por no pisar bien el embrague', tipo: 'leve'},
    { id: 'l114', codigo: '13.2.3', descripcion: 'Reducir marcha y no soltar el embrague', tipo: 'leve'},
    { id: 'l115', codigo: '13.2.4', descripcion: 'Pisar embrague en curva o giro', tipo: 'leve'},
    { id: 'l116', codigo: '13.2.5', descripcion: 'Frenar en curva sin necesidad', tipo: 'leve'},
    { id: 'l117', codigo: '13.2.6', descripcion: 'Mantener pisado el acelerador mientras se cambia de marcha', tipo: 'leve'},
    { id: 'l118', codigo: '13.2.6', descripcion: 'Cambiar de marchas sin alcanzar las revoluciones necesarias', tipo: 'leve'},
    { id: 'l119', codigo: '14.1', descripcion: 'No usar el limpiaparabrisas cuando sea necesario', tipo: 'leve'},
    { id: 'l120', codigo: '14.2', descripcion: 'No usar el cláxon cuando sea necesario', tipo: 'leve'},
    { id: 'l121', codigo: '14.2', descripcion: 'Usar el cláxon de forma antirreglamentaria', tipo: 'leve'},
    { id: 'l122', codigo: '14.3', descripcion: 'Iniciar la marcha con puerta abierta', tipo: 'leve'},
    { id: 'l123', codigo: '14.4', descripcion: 'No usar los mandos relacionados con la visibilidad cuando sea necesario', tipo: 'leve'},
    { id: 'l124', codigo: '15.2', descripcion: 'Subir al bordillo con las ruedas traseras', tipo: 'leve'},
                 
        { id: 'd1', codigo: '3.3', descripcion: 'Incorporación obstaculizando', tipo: 'deficiente'},
        { id: 'd2', codigo: '3.3', descripcion: 'Uso inadecuado de carril de aceleración, obstaculizando', tipo: 'deficiente'},
        { id: 'd3', codigo: '4.1', descripcion: 'No usar carril derecho, obstaculizando', tipo: 'deficiente'},
        { id: 'd4', codigo: '4.2', descripcion: 'Separación frontal',tipo: 'deficiente'},
        { id: 'd5', codigo: '4.3', descripcion: 'Separación lateral con peatones o ciclistas', tipo: 'deficiente'},
        { id: 'd6', codigo: '4.3', descripcion: 'Separación lateral con vehículos u obstáculos', tipo: 'deficiente'},
        { id: 'd7', codigo: '4.4', descripcion: 'Velocidad anormalmente reducida, obstaculizando', tipo: 'deficiente'},
        { id: 'd8', codigo: '4.4', descripcion: 'Reducir velodidad antes de carril de decerelación, obstaculizando', tipo: 'deficiente'},
        { id: 'd9', codigo: '4.4', descripcion: 'Detenerse innecesariamente, obstaculizando', tipo: 'deficiente'},
        { id: 'd10', codigo: '4.5', descripcion: 'Exceder velocidad genérica en +20km/h', tipo: 'deficiente'},
        { id: 'd11', codigo: '4.6', descripcion: 'No facilitar el paso vehículos prioritarios en urgencia', tipo: 'deficiente'},
        { id: 'd12', codigo: '4.6', descripcion: 'Detenerse detrás de obstáculo o vehículo, obstaculizando', tipo: 'deficiente'},
        { id: 'd13', codigo: '4.6', descripcion: 'No facilitar la incorporación, obstaculizando', tipo: 'deficiente'},
        { id: 'd14', codigo: '4.6', descripcion: 'No facilitar la incorporación al autobus, obstaculizando', tipo: 'deficiente'},
        { id: 'd15', codigo: '5.3', descripcion: 'Desplazarse obstaculizando', tipo: 'deficiente'},
        { id: 'd16', codigo: '5.3', descripcion: 'No guardar separación frontolateral con obstáculos o vehículos', tipo: 'deficiente'},
        { id: 'd17', codigo: '5.3', descripcion: 'No penetrar cuánto antes en carril de deceleración, obstaculizando', tipo: 'deficiente'},
        { id: 'd18', codigo: '6.1', descripcion: 'Adelantar notablemente próximo al que precede', tipo: 'deficiente'},
        { id: 'd19', codigo: '6.1', descripcion: 'Adelantar desde demasiado lejos al que precede, obstaculizando', tipo: 'deficiente'},
        { id: 'd20', codigo: '6.2', descripcion: 'Adelantar con lentitud, obstaculizando', tipo: 'deficiente'},
        { id: 'd21', codigo: '6.3', descripcion: 'Adelantar obstaculizando al carril contiguo', tipo: 'deficiente'},
        { id: 'd22', codigo: '6.3', descripcion: 'Adelantar obstaculizando al sentido contrario', tipo: 'deficiente'},
        { id: 'd23', codigo: '6.4.3', descripcion: 'Demorar la vuelta al carril derecho, obstaculizando', tipo: 'deficiente'},
        { id: 'd24', codigo: '6.5', descripcion: 'Aumentar velocidad siendo adelantado, obstaculizando', tipo: 'deficiente'},
        { id: 'd25', codigo: '6.5', descripcion: 'No ceñirse al borde derecho siendo adelantado, obstaculizando', tipo: 'deficiente'},
        { id: 'd26', codigo: '7.3', descripcion: 'Posición no adecuada en franqueo de cruce, obstaculizando', tipo: 'deficiente'},
        { id: 'd27', codigo: '7.4', descripcion: 'Velocidad excesivamente reducida en franqueo de cruce, obstaculizando', tipo: 'deficiente'},
        { id: 'd28', codigo: '7.5', descripcion: 'Detenerse en cruce sin necesidad, obstaculizando', tipo: 'deficiente'},
        { id: 'd29', codigo: '7.5', descripcion: 'Detenerse rebasando posición de entrada, obstaculizando', tipo: 'deficiente'},
        { id: 'd30', codigo: '7.5', descripcion: 'No detenerse obstaculizando a los que tienen prioridad', tipo: 'deficiente'},
        { id: 'd31', codigo: '7.6', descripcion: 'Reanudar la marcha obstaculizando al que tiene prioridad', tipo: 'deficiente'},
        { id: 'd32', codigo: '7.6', descripcion: 'No reanudar a tiempo, obstaculizando', tipo: 'deficiente'},
        { id: 'd33', codigo: '8.3', descripcion: 'Cambiar de sentido estando prohibido por norma, obstaculizando', tipo: 'deficiente'},
        { id: 'd34', codigo: '8.4', descripcion: 'Cambiar de sentido, obstaculizando', tipo: 'deficiente'},
        { id: 'd35', codigo: '8.4', descripcion: 'Cambiar de sentido con +2 movimientos innecesarios', tipo: 'deficiente'},
        { id: 'd36', codigo: '9.3', descripcion: 'Parar/estacionar en lugar prohibido por norma, obstaculizando', tipo: 'deficiente'},
        { id: 'd37', codigo: '9.4', descripcion: 'Parar/estacionar, obstaculizando', tipo: 'deficiente'},
        { id: 'd38', codigo: '9.4', descripcion: 'Estacionar sobresaliendo menos de la mitad', tipo: 'deficiente'},
        { id: 'd39', codigo: '9.4', descripcion: 'Estacionar en batería sobresaliendo +50cm', tipo: 'deficiente'},
        { id: 'd40', codigo: '9.4', descripcion: 'Estacionar sin aprovechar espacio, obstaculizando', tipo: 'deficiente'},
        { id: 'd41', codigo: '9.4', descripcion: 'Abrir la puerta sin observar, obstaculizando', tipo: 'deficiente'},
        { id: 'd42', codigo: '11.1', descripcion: 'Detenerse o no reanudar cuando el agente permite el paso, obstaculizando', tipo: 'deficiente'},
        { id: 'd43', codigo: '11.3', descripcion: 'Detenerse o no reanudar con semáforo con franja blanca vertical, obstaculizando', tipo: 'deficiente'},
        { id: 'd44', codigo: '11.3', descripcion: 'Detenerse o no reanudar con semáforo verde o amarillo intermitente, obstaculizando', tipo: 'deficiente'},
        { id: 'd45', codigo: '11.3', descripcion: 'Rebasar semáforo amarillo fijo pudiendo detenerse con seguridad', tipo: 'deficiente'},
        { id: 'd46', codigo: '11.3', descripcion: 'Rebasar semáforo con franja blanca intermitente, pudiendo detenerse con seguridad', tipo: 'deficiente'},
        { id: 'd47', codigo: '11.3', descripcion: 'No seguir la dirección del semáforo circular con flecha verde, obstaculizando', tipo: 'deficiente'},
        { id: 'd48', codigo: '11.4', descripcion: 'No hacer uso de la preferencia ante señal de prioridad, obstaculizando', tipo: 'deficiente'},
        { id: 'd49', codigo: '11.4', descripcion: 'Exceder velocidad específica en +20km/h', tipo: 'deficiente'},
        { id: 'd50', codigo: '11.4', descripcion: 'Incumplir señal de VELOCIDAD MÍNIMA', tipo: 'deficiente'},
        { id: 'd51', codigo: '11.4', descripcion: 'Obstaculizar a peatones en calle residencial o Zona 30', tipo: 'deficiente'},
        { id: 'd52', codigo: '11.4', descripcion: 'No dejar pasar a los animales en cañadas señalizadas', tipo: 'deficiente'},
        { id: 'd53', codigo: '11.5.1', descripcion: 'Atravesar línea contínua que separa carriles del mismo sentido', tipo: 'deficiente'},
        { id: 'd54', codigo: '11.5.1', descripcion: 'Circular sobre líneas discontínuas, obstaculizando', tipo: 'deficiente'},
        { id: 'd55', codigo: '11.5.1', descripcion: 'Obstaculizar a peatones o ciclistas que se encuentren esperando en sus respectivos pasos', tipo: 'deficiente'},
        { id: 'd56', codigo: '11.5.2', descripcion: 'Detenerse sobre paso de peatones o ciclistas obligando a modificar trayectoria', tipo: 'deficiente'},
        { id: 'd57', codigo: '11.5.4', descripcion: 'Entrar en un cebreado que separa carriles del mismo o distinto sentido', tipo: 'deficiente'},
        { id: 'd58', codigo: '11.5.4', descripcion: 'No seguir la dirección de FLECHA DE SELECCIÓN DE CARRIL', tipo: 'deficiente'},
        { id: 'd59', codigo: '11.5.4', descripcion: 'Detenerse sobre cuadrícula amarilla, obstaculizando', tipo: 'deficiente'},
        { id: 'd60', codigo: '13.1.2', descripcion: 'Confusión del pedal de EMBRAGUE', tipo: 'deficiente'}, 
        { id: 'd61', codigo: '13.1.3', descripcion: 'Confusión del pedal de FRENO', tipo: 'deficiente'},
        { id: 'd62', codigo: '13.1.3', descripcion: 'Confusión del pedal de ACELERADOR', tipo: 'deficiente'},
        { id: 'd63', codigo: '13.1.6', descripcion: 'No desactivar el FRENO DE ESTACIONAMIENTO', tipo: 'deficiente'},
        { id: 'd64', codigo: '13.1.7', descripcion: 'Soltar las dos manos del volante, sin pérdida de dominio', tipo: 'deficiente'},
        { id: 'd65', codigo: '13.2.2', descripcion: 'Dejar caer el vehículo +50cm en sentido contrario al pretendido', tipo: 'deficiente'},
        { id: 'd66', codigo: '13.2.4', descripcion: 'Pisar embrague en curva o giro', tipo: 'deficiente'},
        { id: 'd67', codigo: '13.2.5', descripcion: 'Frenar en curva sin necesidad', tipo: 'deficiente'},
        { id: 'd68', codigo: '14.3', descripcion: 'No desconectar el freno eléctrico afectando la marcha del vehículo', tipo: 'deficiente'},
  
            { id: 'e1', codigo: '4.3', descripcion: 'Separación lateral peligrosa con peatones o ciclistas', tipo: 'eliminatoria'},
            { id: 'e2', codigo: '4.4', descripcion: 'Velocidad inadecuada según vía y clima', tipo: 'eliminatoria'},
            { id: 'e3', codigo: '4.4', descripcion: 'Velocidad no adaptada habiendo sido invitado a ello', tipo: 'eliminatoria'},                                
            { id: 'e4', codigo: '4.4', descripcion: 'Velocidad excesiva en paso para peatones sin visibilidad', tipo: 'eliminatoria'},
            { id: 'e5', codigo: '4.5', descripcion: 'Exceder velocidad genérica en +30km/h', tipo: 'eliminatoria'},
            { id: 'e6', codigo: '6.3', descripcion: 'Adelantar a vehículos de +2 ruedas en cruces sin visibilidad y sin prioridad', tipo: 'eliminatoria'},
            { id: 'e7', codigo: '6.3', descripcion: 'No intentar adelantamiento con circunstancias idóneas', tipo: 'eliminatoria'},
            { id: 'e8', codigo: '6.5', descripcion: 'No disminuir velocidad en situación de peligro', tipo: 'eliminatoria'},
            { id: 'e9', codigo: '7.3', descripcion: 'Circular por sentido contrario en medianas e isletas', tipo: 'eliminatoria'},
            { id: 'e10', codigo: '7.4', descripcion: 'Velocidad inadecuada para las condiciones del cruce', tipo: 'eliminatoria'},
            { id: 'e11', codigo: '8.4', descripcion: 'Cambiar de sentido con +3 movimientos innecesarios', tipo: 'eliminatoria'},
            { id: 'e12', codigo: '9.4', descripcion: 'Estacionar sobresaliendo más de la mitad', tipo: 'eliminatoria'},
            { id: 'e13', codigo: '9.4', descripcion: 'Estacionar en batería sobresaliendo +1m', tipo: 'eliminatoria'},
            { id: 'e14', codigo: '11.1', descripcion: 'No respetar las señales de los agentes', tipo: 'eliminatoria'},
            { id: 'e15', codigo: '11.2', descripcion: 'Incumplir dispositivos de barrera', tipo: 'eliminatoria'},
            { id: 'e16', codigo: '11.2', descripcion: 'Rebasar barrera móvil causando peligro', tipo: 'eliminatoria'},
            { id: 'e17', codigo: '11.3', descripcion: 'No respetar semáforo rojo', tipo: 'eliminatoria'},
            { id: 'e18', codigo: '11.3', descripcion: 'No respetar semáforo rojo intermitente', tipo: 'eliminatoria'},
            { id: 'e19', codigo: '11.3', descripcion: 'No respetar semáforo con franja blanca horizontal', tipo: 'eliminatoria'},
            { id: 'e20', codigo: '11.3', descripcion: 'Ocupar carril con luz roja en forma de aspa', tipo: 'eliminatoria'},
            { id: 'e21', codigo: '11.3', descripcion: 'No ceder el paso a vehículos o peatones con semáforo circular de flecha verde', tipo: 'eliminatoria'},
            { id: 'e22', codigo: '11.3', descripcion: 'No extremar la precaución con semáforo amarillo intermitente', tipo: 'eliminatoria'},
            { id: 'e23', codigo: '11.4', descripcion: 'Incumplir el mandato de señal de CEDA EL PASO', tipo: 'eliminatoria'},
            { id: 'e24', codigo: '11.4', descripcion: 'Incumplir el mandato de señal de STOP', tipo: 'eliminatoria'},
            { id: 'e25', codigo: '11.4', descripcion: 'Incumplir el mandato de señal de PRIORIDAD EN SENTIDO CONTRARIO', tipo: 'eliminatoria'},
            { id: 'e26', codigo: '11.4', descripcion: 'Incumplir el mandato de señal de CIRCULACIÓN PROHIBIDA', tipo: 'eliminatoria'},
            { id: 'e27', codigo: '11.4', descripcion: 'Incumplir el mandato de señal de ENTRADA PROHIBIDA', tipo: 'eliminatoria'},
            { id: 'e28', codigo: '11.4', descripcion: 'Incumplir el mandato de señales de RESTRICCIÓN DE PASO', tipo: 'eliminatoria'},
            { id: 'e29', codigo: '11.4', descripcion: 'Incumplir el mandato otras señales de RESTRICCIÓN O PROHIBICIÓN', tipo: 'eliminatoria'},
            { id: 'e30', codigo: '11.4', descripcion: 'Exceder velocidad específica en +30km/h', tipo: 'eliminatoria'},
            { id: 'e31', codigo: '11.4', descripcion: 'Incumplir el mandato de señales de OBLIGACIÓN', tipo: 'eliminatoria'},
            { id: 'e32', codigo: '11.2', descripcion: 'No respetar señal de carril reservado para autobuses', tipo: 'eliminatoria'},
            { id: 'e33', codigo: '11.5.1', descripcion: 'Circular por la izquierda de línea contínua que separa sentidos opuestos', tipo: 'eliminatoria'},
            { id: 'e34', codigo: '11.5.1', descripcion: 'Atravesar línea contínua que separa sentidos opuestos', tipo: 'eliminatoria'},
            { id: 'e35', codigo: '11.5.2', descripcion: 'No ceder el paso a peatones o ciclistas que crucen por sus respectivos pasos', tipo: 'eliminatoria'},
            { id: 'e36', codigo: '11.5.3', descripcion: 'Incumplir señal horizontal de CEDA EL PASO', tipo: 'eliminatoria'},
            { id: 'e37', codigo: '11.5.3', descripcion: 'Incumplir señal horizontal de STOP', tipo: 'eliminatoria'},
            { id: 'e38', codigo: '11.5.4', descripcion: 'Circular o atravesar por la izquierda de un cebreado que separa sentidos opuestos', tipo: 'eliminatoria'},
            { id: 'e39', codigo: '11.5.5', descripcion: 'Incumplir líneas amarillas contínua, discontínua o zig-zag', tipo: 'eliminatoria'},
            { id: 'e40', codigo: '12.1', descripcion: 'Circular negligentemente por no usar alumbrado correspondiente', tipo: 'eliminatoria'},
            { id: 'e41', codigo: '12.4', descripcion: 'Usar luz de carretera deslumbrando, causando peligro'},
            { id: 'e42', codigo: '12.5', descripcion: 'No usar luz antiniebla trasera cuando sea obligatoria, causando peligro', tipo: 'eliminatoria'},
            { id: 'e43', codigo: '14.1', descripcion: 'No usar limpiaparabrisas cuando sea imprescindible', tipo: 'eliminatoria'},
            { id: 'e44', codigo: '14.2', descripcion: 'No usar el claxón cuando sea necesario', tipo: 'eliminatoria'},
            { id: 'e45', codigo: '14.3', descripcion: 'Desconocimiento de los mandos relacionados con la seguridad cuando sea necesario', tipo: 'eliminatoria'},
            { id: 'e46', codigo: '14.4', descripcion: 'Desconocimiento de los mandos relacionados con la visibilidad cuando sea necesario', tipo: 'eliminatoria'},
            { id: 'e47', codigo: '15.1.1', descripcion: 'Accidente por golpear a personas, animales, vehículos o elementos', tipo: 'eliminatoria'},
            { id: 'e48', codigo: '15.1.2', descripcion: 'Crear rieso relevante obligando a maniobra evasiva', tipo: 'eliminatoria'},
            { id: 'e49', codigo: '15.1.3', descripcion: 'Circular o invadir sentido contrario sin visibilidad', tipo: 'eliminatoria'},
            { id: 'e50', codigo: '15.1.4', descripcion: 'Perder el domino sobre el vehículo', tipo: 'eliminatoria'},
            { id: 'e51', codigo: '15.1.4', descripcion: 'Acompañar reiteradamente la moto con los pies', tipo: 'eliminatoria'},
            { id: 'e52', codigo: '15.1.5', descripcion: 'Caida de la moto sin causa justificada', tipo: 'eliminatoria'},
            { id: 'e53', codigo: '15.1.6', descripcion: 'Intervención del profesor durante el desarrollo de la prueba', tipo: 'eliminatoria'},
            { id: 'e54', codigo: '15.2', descripcion: 'Subir al bordillo con las ruedas delanteras', tipo: 'eliminatoria'},
            { id: 'e55', codigo: '15.3', descripcion: 'No seguir reiteradamente las indicaciones del examindor', tipo: 'eliminatoria'},
];

function cargarCatalogoFaltas() {
    try {
        if (!localStorage.getItem('catalogoFaltas')) {  
            console.log('No catalog found, initializing defaults');
            localStorage.setItem('catalogoFaltas', JSON.stringify(FALTAS_PREDETERMINADAS));
            return FALTAS_PREDETERMINADAS;
        } 
        
        // Get from storage and validate
        const faltas = JSON.parse(localStorage.getItem('catalogoFaltas'));
        if (!Array.isArray(faltas) || faltas.length === 0) {
            console.warn('Invalid or empty fault catalog in storage, resetting to defaults');
            localStorage.setItem('catalogoFaltas', JSON.stringify(FALTAS_PREDETERMINADAS));
            return FALTAS_PREDETERMINADAS;
        }
        return faltas;
    } catch (error) {
        console.error('Error loading fault catalog:', error);
        localStorage.setItem('catalogoFaltas', JSON.stringify(FALTAS_PREDETERMINADAS));
        return FALTAS_PREDETERMINADAS;
    }
}

function inicializarCatalogoFaltas() {
    // Always ensure catalog exists and has data
    if (!localStorage.getItem('catalogoFaltas')) {
        console.log('Initializing default fault catalog');
        localStorage.setItem('catalogoFaltas', JSON.stringify(FALTAS_PREDETERMINADAS));
    } else {
        // Validate existing catalog
        try {
            const faltas = JSON.parse(localStorage.getItem('catalogoFaltas'));
            if (!Array.isArray(faltas) || faltas.length === 0) {
                console.warn('Invalid catalog found, resetting to defaults');
                localStorage.setItem('catalogoFaltas', JSON.stringify(FALTAS_PREDETERMINADAS));
            }
        } catch (error) {
            console.error('Error validating catalog:', error);
            localStorage.setItem('catalogoFaltas', JSON.stringify(FALTAS_PREDETERMINADAS));
        }
    }
}

function agregarFalta(alta) {  
    if (!alta.descripcion || !alta.tipo) throw new Error('Missing description description or type');
    
    const nuevaFalta = { 
        id: Date.now().toString(),
        codigo: (alta.codigo || ''),       
        descripcion: alta.descripcion,
        tipo: alta.tipo,
        activa: true // default active
    };
    
    const faltas = cargarCatalogoFaltas();
    faltas.push(nuevaFalta);
    localStorage.setItem('catalogoFaltas', JSON.stringify(faltas));
    return nuevaFalta;
}

// Update an existing fault
function actualizarFalta(alta)  {    
    const faltas = cargarCatalogoFaltas();
    const index = faltas.findIndex(f => f.id === alta.id);
    if (index !== -1) {
        faltas[index] = {...faltas[index], ...alta};
        localStorage.setItem('catalogoFaltas', JSON.stringify(faltas));
    }
    return alta;
}

// Delete a fault from the catalog
function eliminarFalta(id) {    
    const faltas = cargarCatalogoFaltas();
    const filtered = faltas.filter(f => f.id !== id);
    localStorage.setItem('catalogoFaltas', JSON.stringify(filtered));
    return filtered.length;
}

// Order faults according to criterion
function ordenarFaltas(criterio = '') {
    const faltas = cargarCatalogoFaltas();
    
    switch (criterio) {
        case 'codigo':
            return faltas.sort((a, b) => a.codigo.localeCompare(b.codigo));
        case 'tipo':
            return faltas.sort((a, b) => a.tipo.localeCompare(b.tipo));
        default:
            return faltas;
    }
}

// Export all functions - Fixed export section
export {
    FALTAS_PREDETERMINADAS,
    cargarCatalogoFaltas,
    agregarFalta,
    actualizarFalta,
    eliminarFalta,
    ordenarFaltas,
    inicializarCatalogoFaltas
};
