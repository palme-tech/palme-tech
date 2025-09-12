# Blinderkitten Lighting Configurations

[Blinderkitten](https://blinderkitten.lighting/) is an [open source](https://github.com/norbertrostaing/BlinderKitten/) DMX controller

`*.olga`: cue lists and lighting configurations, usually segregated by productions

`*.blinderlayout`: blinderkitten layouts (window positions in the UI) that are configuration agnostic

Some notes:

- We use a usb to DMX output FTDI device, which requires per-system setup. Head to `Interfaces` > `DMX Universe` > `OpenDMX` and select the device in the `Port` dropdown.
