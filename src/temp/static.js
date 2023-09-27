const staticData = {
    gpus : null,
    cpu : null,
    motherboard : null,
    harddrives : null,
    rams : null,
    miners: null,
    systemInfo: null,
    get calculations() {
        return {
            gpusCount: staticData.gpus.length,
            get gpusNvidia () {
                if (staticData.gpus) {
                    var count = 0;
                    staticData.gpus.forEach(gpu => {
                        if (gpu.information.manufacturer.toLowerCase() == 'nvidia') {
                            count++;
                        } 
                        })
                    return count;
                } else {
                    return null;
                }
            },
            get gpusAmd () {
                if (staticData.gpus) {
                    var count = 0;
                    staticData.gpus.forEach(gpu => {
                        if (gpu.information.manufacturer.toLowerCase() == 'amd') {
                            count++;
                        }
                    })
                    return count; 
                } else {
                    return null;
                }
            }
        }
    }, 
}

export { staticData }