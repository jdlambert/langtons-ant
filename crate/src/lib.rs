use std::fmt;

mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

mod ant {
    #[derive(Clone, Copy, Debug, PartialEq, Eq)]
    pub enum Direction {
        North,
        East,
        South,
        West,
    }

    #[derive(Clone, Copy, Debug, PartialEq, Eq)]
    pub struct Ant {
        pub row: u32,
        pub col: u32,
        pub direction: Direction,
    }
}

use ant::{Ant, Direction, Direction::*};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Behavior {
    Left,
    Right,
}

use Behavior::*;

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<u8>,
    behaviors: Vec<Behavior>,
    ant: Ant,
}

fn behavior_from_char(c: char) -> Result<Behavior, String> {
    match c {
        'L' | 'l' => Ok(Left),
        'R' | 'r' => Ok(Right),
        _ => Err(format!("Unknown char {}", c))
    }
}

fn behaviors_from_str(s: &str) -> Vec<Behavior> {
    s.chars().map(|c| behavior_from_char(c).unwrap()).collect()
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Universe {
        utils::set_panic_hook();
        let cells = vec![0; (width * height) as usize];
        let behaviors = behaviors_from_str("LRRRRRLLR");
        let ant = Ant {
            row: height / 2,
            col: width / 2,
            direction: North,
        };
        Universe {
            width,
            height,
            cells,
            behaviors,
            ant,
        }
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const u8 {
        self.cells.as_ptr()
    }

    fn new_ant_loc(&self, ant: Ant) -> (u32, u32) {
        match ant.direction {
            North => (
                if ant.row == 0 {
                    self.height - 1
                } else {
                    ant.row - 1
                },
                ant.col,
            ),
            East => (
                ant.row,
                if ant.col == self.width - 1 {
                    0
                } else {
                    ant.col + 1
                },
            ),
            South => (
                if ant.row == self.height - 1 {
                    0
                } else {
                    ant.row + 1
                },
                ant.col,
            ),
            West => (
                ant.row,
                if ant.col == 0 {
                    self.width - 1
                } else {
                    ant.col - 1
                },
            ),
        }
    }

    fn new_ant_dir(&self, ant: Ant, current_color: u8) -> Direction {
        match (ant.direction, self.behaviors[current_color as usize]) {
            (North, Right) | (South, Left) => East,
            (North, Left) | (South, Right) => West,
            (East, Right) | (West, Left) => South,
            (East, Left) | (West, Right) => North,
        }
    }

    pub fn tick(&mut self) -> Vec<u32> {
        let (row, col) = self.new_ant_loc(self.ant);
        let index = self.get_index(row, col);
        let current_color = self.cells[index];
        self.cells[index] = if current_color == ((self.behaviors.len() - 1) as u8) {
            0
        } else {
            current_color + 1
        };
        let direction = self.new_ant_dir(self.ant, current_color);
        self.ant = Ant {
            row,
            col,
            direction,
        };
        vec![row, col, self.cells[index] as u32]
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell > 0 { '◼' } else { '◻' } ;
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }
        Ok(())
    }
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, langtons-ant-wasm!");
}
