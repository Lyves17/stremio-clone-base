const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.stremio.example",
    version: "1.0.0",
    name: "Exemple Add-on Streaming",
    description: "Un add-on de test pour films",
    types: ["movie"],
    catalogs: [
        {
            type: "movie",
            id: "example_catalog"
        }
    ],
    resources: ["catalog", "stream"],
    idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(() => {
    return Promise.resolve({
        metas: [
            {
                id: "tt1234567",
                name: "Film de Test",
                type: "movie",
                poster: "https://via.placeholder.com/150",
                description: "Un film factice pour test."
            }
        ]
    });
});

builder.defineStreamHandler(({ id }) => {
    if (id === "tt1234567") {
        return Promise.resolve({
            streams: [
                {
                    title: "Serveur 1",
                    url: "https://test-streaming-site.com/film.mp4"
                }
            ]
        });
    } else {
        return Promise.resolve({ streams: [] });
    }
});

module.exports = builder.getInterface();

if (require.main === module) {
    const express = require("express");
    const app = express();

    const interface = module.exports;

    app.get("/manifest.json", (req, res) => {
        res.send(interface.manifest);
    });

    app.get("/:resource/:type/:id?.json", (req, res) => {
        interface.get(req.params).then(resp => res.send(resp));
    });

    const port = process.env.PORT || 7000;
    app.listen(port, () => {
        console.log(`Add-on en ligne sur http://localhost:${port}`);
    });
}
