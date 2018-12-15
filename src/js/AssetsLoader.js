

export default class Loader {
    static imgArr = [];
    static soundArr = [];

    static load(resourceTable) {
        return new Promise((resolve) => {
            const resourcePromises = [];
            for (let resourceType of Object.keys(resourceTable)) {
                const resourceSrcArr = resourceTable[resourceType];
                if (resourceType === 'image') {
                    resourcePromises.push(resourceSrcArr.map((src) => {
                        this.loadImage(src);
                    }));
                }
                if (resourceType === 'audio') {
                    resourcePromises.push(resourceSrcArr.map((src, i) => {
                        this.loadAudio(src, i);
                    }));
                }
            }
            Promise.all(resourcePromises).then(() => {
                resolve();
            });
        });
    }

    static loadImage(src) {
        return new Promise((loaded) => {
            const source = new Image();
            source.src = src;
            source.addEventListener('load', () => {
                loaded();
            });
            this.imgArr.push(source);
        });
    }

    static loadAudio(src, i) {
        return new Promise((loaded) => {
            const source = new Audio();
            source.src = src;
            source.addEventListener('load', () => {
                loaded();
            });
            source.volume = 1;
            if (i === 2 || i === 3 || i === 4) {
                source.volume = .3;
            }
            this.soundArr.push(source);
        });
    }
}
