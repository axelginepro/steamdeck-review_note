import decky_plugin


class Plugin:
    async def _main(self) -> None:
        decky_plugin.logger.info("Steam Reviews plugin loaded")

    async def _unload(self) -> None:
        pass
