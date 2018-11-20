import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { clipPolylinesToBox } from 'penplot/util/geom';
import flattenLineTree from 'flatten-line-tree';
import Transmutation from './transmutation';
import regularPolygon from 'regular-polygon';
import { start } from 'repl';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.LETTER;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;
  const margin = 1.5;
  const working_width = width - margin * 2;
  const working_height = height - margin * 2; 
  const center = [width / 2, height / 2];
  const starting_size = 7;
  const max_size = working_width;
  const min_size = 1;
  let lines = [];

  lines.push(Transmutation.transmute(center, starting_size, max_size, min_size));

  // Clip all the lines to a margin
  const box = [ margin, margin, width - margin, height - margin ];
  lines = flattenLineTree(lines);
  lines = clipPolylinesToBox(lines, box);

  return {
    draw,
    print,
    background: 'white',
    animate: false,
    clear: true
  };

  function draw () {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => context.lineTo(p[0], p[1]));
      context.stroke();
    });
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}
