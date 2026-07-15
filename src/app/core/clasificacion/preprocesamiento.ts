/**
 * preprocesamiento.ts
 * -------------------------------------------------------------
 * Convierte texto libre (los comentarios de la encuesta) en vectores
 * numéricos que los algoritmos puedan usar. Implementa un modelo de
 * "bolsa de palabras" (bag-of-words) y su variante TF-IDF.
 *
 * IMPORTANTE: el vocabulario se construye SOLO con los textos de
 * entrenamiento. Si se construyera con los de prueba también, el modelo
 * "vería" datos que no debería y las métricas saldrían infladas (fuga
 * de datos). Por eso Vectorizador.ajustar() se llama solo con el train.
 */

/**
 * Lista de palabras vacías en español. NO es exhaustiva: cubre las más
 * frecuentes (artículos, preposiciones, pronombres, conjunciones). Se
 * puede ampliar sin afectar al resto del código.
 */
const STOPWORDS_ES = new Set<string>([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'al', 'del',
  'de', 'a', 'ante', 'con', 'contra', 'desde', 'en', 'entre', 'hacia', 'hasta',
  'para', 'por', 'segun', 'sin', 'sobre', 'tras', 'y', 'e', 'o', 'u', 'ni',
  'que', 'como', 'cuando', 'donde', 'quien', 'cual', 'cuyo', 'porque', 'pues',
  'si', 'no', 'mas', 'pero', 'aunque', 'ya', 'me', 'te', 'se', 'nos', 'os',
  'le', 'les', 'mi', 'tu', 'su', 'sus', 'mis', 'tus', 'yo', 'el', 'ella',
  'ellos', 'ellas', 'nosotros', 'ustedes', 'este', 'esta', 'esto', 'estos',
  'estas', 'ese', 'esa', 'eso', 'esos', 'esas', 'aquel', 'es', 'son', 'era',
  'fue', 'ser', 'estar', 'esta', 'estan', 'hay', 'he', 'ha', 'han', 'muy',
  'mucho', 'poco', 'todo', 'toda', 'todos', 'todas', 'algo', 'nada', 'tan',
  'tambien', 'solo', 'asi', 'aqui', 'ahi', 'alli', 'me', 'les', 'lo'
]);

/**
 * Limpia y trocea un texto en palabras (tokens).
 * Pasos: minúsculas -> quitar acentos -> dejar solo letras/espacios ->
 * separar por espacios -> quitar stopwords y tokens muy cortos.
 */
export function tokenizar(texto: string): string[] {
  if (!texto) return [];
  const sinAcentos = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // elimina las marcas de acento

  const soloLetras = sinAcentos.replace(/[^a-zñ\s]/g, ' ');

  return soloLetras
    .split(/\s+/)
    .filter(t => t.length >= 3 && !STOPWORDS_ES.has(t));
}

/** Un vector disperso: índice de palabra -> conteo. */
type VectorConteo = Map<number, number>;

/**
 * Construye el vocabulario a partir del train y transforma textos en
 * vectores. Guarda el IDF para poder calcular TF-IDF.
 */
export class Vectorizador {
  /** palabra -> índice de columna en el vector. */
  private vocabulario = new Map<string, number>();
  /** IDF por índice de palabra (para TF-IDF). */
  private idf: number[] = [];
  private ajustado = false;

  get tamanoVocabulario(): number {
    return this.vocabulario.size;
  }

  /** Aprende el vocabulario y el IDF SOLO con los textos de entrenamiento. */
  ajustar(textos: string[]): void {
    // 1) Recolectar todas las palabras y en cuántos documentos aparece cada una.
    const docFreq = new Map<string, number>();
    const docsTokenizados = textos.map(t => tokenizar(t));

    for (const tokens of docsTokenizados) {
      const unicas = new Set(tokens);
      for (const palabra of unicas) {
        docFreq.set(palabra, (docFreq.get(palabra) ?? 0) + 1);
      }
    }

    // 2) Asignar un índice de columna a cada palabra (orden estable).
    let indice = 0;
    for (const palabra of [...docFreq.keys()].sort()) {
      this.vocabulario.set(palabra, indice++);
    }

    // 3) IDF suavizado: log((1 + N) / (1 + df)) + 1
    const N = textos.length;
    this.idf = new Array(this.vocabulario.size).fill(0);
    for (const [palabra, df] of docFreq) {
      const col = this.vocabulario.get(palabra)!;
      this.idf[col] = Math.log((1 + N) / (1 + df)) + 1;
    }

    this.ajustado = true;
  }

  /** Vector de conteos (para Naive Bayes multinomial). */
  contar(texto: string): VectorConteo {
    this.verificarAjustado();
    const v: VectorConteo = new Map();
    for (const palabra of tokenizar(texto)) {
      const col = this.vocabulario.get(palabra);
      if (col !== undefined) v.set(col, (v.get(col) ?? 0) + 1);
    }
    return v;
  }

  /** Vector TF-IDF denso y normalizado en L2 (para KNN y Reg. Logística). */
  tfidf(texto: string): number[] {
    this.verificarAjustado();
    const v = new Array(this.vocabulario.size).fill(0);
    const conteo = this.contar(texto);
    for (const [col, tf] of conteo) {
      v[col] = tf * this.idf[col];
    }
    // Normalización L2 -> permite usar producto punto como coseno.
    const norma = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    if (norma > 0) {
      for (let i = 0; i < v.length; i++) v[i] /= norma;
    }
    return v;
  }

  /** Vector binario de presencia (para el árbol de decisión). */
  presencia(texto: string): number[] {
    this.verificarAjustado();
    const v = new Array(this.vocabulario.size).fill(0);
    for (const col of this.contar(texto).keys()) v[col] = 1;
    return v;
  }

  private verificarAjustado(): void {
    if (!this.ajustado) {
      throw new Error('Vectorizador no ajustado: llama a ajustar(train) primero.');
    }
  }
}
