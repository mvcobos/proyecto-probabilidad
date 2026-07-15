

% ====================== PORTADA ======================

{ Universidad Politécnica Salesiana}\\[0.3cm]
{ Carrera de Ingeniería en Computación}\\[0.3cm]
{ Asignatura: Probabilidad y Estadística}\\[2.5cm]

{ **Informe del Proyecto**}\\[0.8cm]
{ **Sistema Comparativo de Algoritmos de Clasificación Aplicados al Análisis de Percepción Estudiantil**}\\[2.5cm]

{ **Integrantes:**}\\[0.4cm]
{ Verónica Cobos}\\
{ Jonnathan Párraga}\\
{ Carolina Fortmann}\\
{ Emanuel León}\\[3cm]

{ 20 de mayo de 2026}

% ====================== INTRODUCCIÓN ======================
# Introducción

El presente informe describe el desarrollo de una plataforma web orientada a recolectar, clasificar y visualizar la percepción de los estudiantes de la carrera de Ingeniería en Computación respecto a las metodologías de enseñanza empleadas en las distintas asignaturas. El proyecto se enmarca en la asignatura de Probabilidad y Estadística y aplica de manera práctica los conceptos estadísticos revisados en clase, en particular la estadística descriptiva, el muestreo, la construcción de variables y la comparación de resultados entre distintos modelos.

El trabajo no se limita a una propuesta teórica. Se construye un sistema funcional que recoge respuestas reales de estudiantes mediante una encuesta, transforma los comentarios en datos analizables y aplica cuatro algoritmos de clasificación supervisada para categorizar automáticamente las opiniones. A partir de los datos obtenidos se realiza un análisis estadístico comparativo que permite establecer qué algoritmo ofrece el mejor desempeño bajo las condiciones del problema. De esta forma, el informe integra el componente experimental, la recolección de información real y la interpretación estadística de los resultados.

% ====================== PROBLEMA ======================
# Planteamiento del Problema

En la carrera de Ingeniería en Computación, las asignaturas combinan componentes teóricos y prácticos en proporciones que varían según la materia y el docente. La percepción de los estudiantes sobre ese equilibrio es una fuente de información valiosa para mejorar la enseñanza; sin embargo, esa opinión rara vez se recoge de forma estructurada y, cuando se recoge, suele quedar en formato de texto libre que resulta difícil de procesar y comparar.

El problema central radica en que las opiniones expresadas en lenguaje natural no son directamente cuantificables. Una respuesta escrita como ``las clases prácticas me ayudaron mucho a entender la materia'' contiene información clara para un lector humano, pero no puede agregarse, contarse ni comparar con cientos de respuestas más sin un proceso previo de clasificación. Revisar y etiquetar manualmente grandes volúmenes de comentarios es una tarea lenta, costosa y propensa a la inconsistencia entre evaluadores.

Surge entonces la pregunta que guía este trabajo: ¿es posible clasificar automáticamente los comentarios de los estudiantes en categorías de percepción (positivo, neutro o negativo) con un nivel de exactitud aceptable, y cuál de los algoritmos de clasificación supervisada disponibles resulta más adecuado para este tipo de datos? Responder a esta pregunta exige no solo implementar los algoritmos, sino también medir y comparar su desempeño con criterios estadísticos objetivos.

% ====================== JUSTIFICACIÓN ======================
# Justificación

El motivo de este proyecto se sustenta en tres aspectos: académico, técnico y práctico.

En un objetivo académico, el trabajo permite aplicar de manera concreta los contenidos de la asignatura de Probabilidad y Estadística. La comparación entre algoritmos no se resuelve por intuición, sino mediante métricas estadísticas (exactitud, precisión, exhaustividad y valor F1) y a través del análisis de la distribución de las respuestas. El proyecto obliga a trabajar con conceptos como variable, muestra, proporción y medida de desempeño, que son centrales en la materia.

Desde un punto vista técnico, clasificar texto de forma automática es un problema clásico del aprendizaje supervisado y constituye uno de los usos más extendidos de los clasificadores probabilísticos y basados en distancia . Comparar varios algoritmos sobre un mismo conjunto de datos es, además, una práctica recomendada, pues ningún clasificador es superior en todos los escenarios y la elección debe apoyarse en evidencia empírica .

En la parte práctico, el sistema genera información útil para la mejora continua de la enseñanza. Conocer de forma agregada cómo perciben los estudiantes el equilibrio entre teoría y práctica de cada materia ofrece a docentes y coordinadores una base objetiva para ajustar sus metodologías, sin depender de impresiones aisladas.

% ====================== OBJETIVOS ======================
# Objetivos

## Objetivo general

Desarrollar una aplicación web que compare el desempeño de distintos algoritmos de clasificación supervisada aplicados al análisis automático de las opiniones de los estudiantes sobre las metodologías de enseñanza en la carrera de Ingeniería en Computación.

## Objetivos específicos

[label=., leftmargin=1.4cm]
  -  Diseñar e implementar una encuesta que recoja la percepción de los estudiantes sobre las clases teóricas y prácticas de cada asignatura, combinando preguntas en escala de Likert y preguntas abiertas.
  -  Construir un conjunto de datos a partir de respuestas reales de estudiantes y aplicar una estrategia de etiquetado que permita entrenar los modelos de clasificación.
  -  Implementar cuatro algoritmos de clasificación supervisada (Naive Bayes, K vecinos más cercanos, árboles de decisión y regresión logística) para categorizar los comentarios en positivo, neutro o negativo.
  -  Comparar el rendimiento de los algoritmos mediante métricas estadísticas estándar de clasificación.
  -  Generar visualizaciones y reportes que faciliten la interpretación de los resultados por bloques académicos y por asignatura.

% ====================== METODOLOGÍA ======================
# Metodología

El desarrollo del proyecto se organiza en cinco fases. Su orden refleja la dependencia natural entre etapas: no es posible clasificar sin datos, ni comparar sin haber clasificado.

## Fase 1: Diseño de la encuesta y recolección de datos

La aplicación presenta una página principal con tarjetas que representan cada semestre académico. Al seleccionar un semestre, el sistema muestra las asignaturas de ese período y también las del semestre inmediatamente anterior, de modo que se recoja la opinión tanto de quienes cursan la materia en el momento como de quienes la cursaron recientemente. El análisis se limita a las asignaturas técnicas y científicas propias de la carrera; quedan fuera las materias del área Salesiana y de Formación Personal.

Una vez elegida la asignatura, el estudiante completa un formulario de siete preguntas: cuatro en escala de Likert de cinco puntos (1 = totalmente en desacuerdo; 5 = totalmente de acuerdo) y tres preguntas abiertas. Las preguntas de Likert miden el equilibrio entre teoría y práctica, la utilidad de las clases prácticas, la utilidad de las clases teóricas y la percepción general de aprendizaje. Las preguntas abiertas indagan sobre la parte teórica, la parte práctica y las posibles mejoras de la metodología.

## Fase 2: Preparación y etiquetado del conjunto de datos

Los algoritmos de clasificación supervisada requieren datos previamente etiquetados para su entrenamiento. Dado que el etiquetado manual de todos los comentarios resultaría costoso, se adopta una estrategia de etiquetado semiautomático apoyada en las respuestas cuantitativas. La etiqueta inicial de cada comentario se deriva del valor de Likert asociado, según el criterio orientativo de la Tabla~.

Para el comentario sobre la parte teórica se toma como referencia la pregunta de Likert relativa a las clases teóricas, y para el comentario sobre la parte práctica, la pregunta relativa a las clases prácticas. Esta estrategia es una propuesta metodológica que se valida durante la implementación: se revisa manualmente una muestra de los datos para verificar la coherencia entre la etiqueta derivada y el contenido real del comentario. La pregunta abierta sobre mejoras de la metodología se almacena con fines informativos y no forma parte del proceso de clasificación automática.

Antes del entrenamiento, los textos se someten a un preprocesamiento básico de lenguaje natural: conversión a minúsculas, eliminación de signos de puntuación y de palabras vacías, y representación de cada comentario como un vector de características mediante un modelo de bolsa de palabras .

## Fase 3: Implementación de los algoritmos

Se implementan y comparan cuatro algoritmos de clasificación supervisada, seleccionados por ser modelos clásicos, ampliamente documentados y de complejidad adecuada para el volumen de datos previsto:

[leftmargin=1.4cm]
  -  **Naive Bayes**, clasificador probabilístico basado en el teorema de Bayes que asume independencia entre las características; es un modelo simple y eficiente, frecuentemente usado como referencia en clasificación de texto .
  -  **K vecinos más cercanos (KNN)**, que clasifica cada comentario según la categoría predominante entre sus vecinos más próximos en el espacio de características .
  -  **Árboles de decisión**, que construyen reglas de clasificación a partir de los atributos del texto mediante divisiones sucesivas guiadas por criterios de ganancia de información .
  -  **Regresión logística**, modelo lineal que estima la probabilidad de pertenencia a cada categoría.

## Fase 4: Entrenamiento y evaluación

El conjunto de datos se divide en subconjuntos de entrenamiento y prueba. Cada algoritmo se entrena con el subconjunto de entrenamiento y se evalúa sobre el de prueba, de manera que el desempeño se mida sobre datos que el modelo no vio durante su ajuste. Para que la comparación sea justa, los cuatro algoritmos se entrenan y evalúan sobre exactamente el mismo conjunto de datos y bajo las mismas condiciones de preprocesamiento.

## Fase 5: Análisis comparativo y visualización

Con los resultados de la evaluación se realiza el análisis estadístico comparativo descrito en la Sección~ y se generan las visualizaciones que conforman el panel de resultados del sistema.

% ====================== DATOS QUE SE OBTENDRÁN ======================
# Datos que se Obtendrán

El sistema genera dos grandes tipos de datos a partir de cada encuesta respondida.

Los **datos cuantitativos** provienen de las cuatro preguntas de Likert y toman valores enteros de 1 a 5. Sobre ellos se calculan medidas de tendencia central y de dispersión, así como las distribuciones de frecuencia por asignatura y por bloque académico.

Los **datos cualitativos** provienen de las tres preguntas abiertas. Los comentarios sobre la parte teórica y la parte práctica se procesan y se clasifican en las categorías positivo, neutro o negativo; el comentario sobre mejoras se conserva como información complementaria.

Para asegurar un mínimo de representatividad, la sección de resultados de una asignatura se habilita únicamente cuando esta alcanza al menos 150 respuestas válidas. De este modo, las estadísticas y la clasificación se calculan sobre una muestra de tamaño suficiente y no sobre unos pocos casos aislados.

% ====================== HERRAMIENTAS ======================
# Herramientas Utilizadas

El desarrollo se apoya en un conjunto de herramientas de uso estándar en la industria y la academia. La interfaz web (módulos de inicio, encuesta y resultados) se construye con tecnologías de desarrollo frontend, mientras que las respuestas se almacenan en una base de datos relacional. El procesamiento de los comentarios y la implementación de los algoritmos de clasificación se realizan 

% ====================== ANÁLISIS ESTADÍSTICO ======================
# Análisis Estadístico

El análisis estadístico tiene dos componentes complementarios.

El primero es de tipo **descriptivo**: a partir de las respuestas de Likert se obtienen las medidas de tendencia central y de dispersión y las distribuciones de frecuencia de las categorías de percepción, desagregadas por asignatura y por bloque académico. Este componente responde a la pregunta de qué opinan los estudiantes.

El segundo es de tipo **comparativo** y se centra en el desempeño de los algoritmos. Para cada modelo se calculan cuatro métricas estándar de clasificación, resumidas en la Tabla~: exactitud, precisión, exhaustividad y valor F1. El uso conjunto de estas métricas, y no solo de la exactitud, es importante cuando las categorías no están equilibradas, situación habitual cuando predominan las opiniones positivas o negativas . Adicionalmente se registran el error de clasificación y el tiempo de cómputo de cada algoritmo, con el fin de valorar no solo su precisión sino también su eficiencia.

En este esquema, el tipo de algoritmo, el tamaño del conjunto de datos y el tipo de comentario (teórico o práctico) constituyen las variables independientes, mientras que las métricas de desempeño, el error y el tiempo de clasificación son las variables dependientes.

% ====================== EVIDENCIAS ======================
# Evidencias Reales del Desarrollo

El proyecto produce evidencias verificables en cada una de sus fases, lo que permite comprobar que se trata de un trabajo experimental y no de una propuesta meramente teórica. Estas evidencias son:

[leftmargin=1.4cm]
  -  El sistema web funcional, ejecutable en entorno local, con sus módulos de inicio, encuesta y resultados.
  -  El conjunto de datos con las respuestas reales de los estudiantes, almacenado en la base de datos del sistema.
  -  Las tablas de métricas obtenidas para cada algoritmo, que permiten comparar su desempeño con valores concretos.
  -  Las visualizaciones y reportes generados en el panel de resultados, agrupados por bloque académico y por asignatura.
  -  El código fuente organizado y documentado.

% ====================== AGRUPACIÓN ======================
# Agrupación de Asignaturas por Bloques Académicos

Para facilitar el análisis, las asignaturas evaluadas se organizan en ocho bloques temáticos: Fundamentos Matemáticos; Gestión de Datos e Información; Programación y Software; Fundamentos de Hardware y Circuitos; Física para Computación; Sistemas de Información; Redes y Teleprocesamiento; e Inteligencia Artificial y Computación de Alto Rendimiento. Esta agrupación permite presentar resultados a un nivel agregado y, al seleccionar un bloque, acceder al detalle de cada materia que lo compone.

% ====================== RESULTADO ESPERADO ======================
# Resultado Esperado

Se espera obtener una plataforma web capaz de recolectar opiniones estudiantiles de forma estructurada, clasificar automáticamente los comentarios en positivo, neutro o negativo, mostrar estadísticas y visualizaciones interactivas, y comparar el desempeño de los cuatro algoritmos de clasificación. El resultado final permitirá identificar cuál de ellos ofrece el mejor compromiso entre exactitud y eficiencia para este tipo de datos, así como obtener una visión global de la percepción estudiantil frente a las clases teóricas y prácticas. Las conclusiones definitivas dependerán de los resultados que se obtengan tras la recolección y el procesamiento de las respuestas reales.

% ====================== REFERENCIAS ======================

