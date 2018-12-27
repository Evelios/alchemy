// External Modules
import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { clipPolylinesToBox } from 'penplot/util/geom';
import flattenLineTree from 'flatten-line-tree';
import transmutation from './transmutation';

// Transmutations
import Inset from './transmutations/inset';
import Inscribe from './transmutations/inscribe';
import InternalFork from './transmutations/internal-fork';
import ExternalFork from './transmutations/external-fork';
import Ring from './transmutations/ring';
import Spyglass from './transmutations/spyglass';

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

  const algorithms = [
    Inset,
    // Inscribe,
    // InternalFork,
    // ExternalFork,
    // Ring,
    // Spyglass,
  ];

  let lines = transmutation({
    center,
    starting_size,
    max_size,
    min_size,
    algorithms,
  });

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
