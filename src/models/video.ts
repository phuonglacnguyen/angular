export class Video {
    constructor(
        public bitrate: number = 0,
        public aspect: string = "",
        public width: number = 0,
        public height: number = 0,
        public container: string = "",
        public codec: string = "",
        public fps: number = 0
    ) { }
}