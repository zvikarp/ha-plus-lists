# Contributing

Use Python 3.13 and Node.js 24, matching HA+ Modes CI.

```sh
python3.13 -m venv .venv
. .venv/bin/activate
pip install --no-deps homeassistant==2025.1.3 pytest-homeassistant-custom-component==0.13.204
python -c "import homeassistant,pathlib,subprocess,sys; constraints=pathlib.Path(homeassistant.__file__).with_name('package_constraints.txt'); subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-c', str(constraints), '.[test]'])"
ruff check .
ruff format --check .
pytest
npm ci --ignore-scripts
npm test
```

The test dependencies pin pyparsing and python-dateutil for compatibility with the 2025.1 baseline’s iCalendar parser. These pins do not change the integration’s runtime requirements.

The Python tests exercise HA's real to-do entity services, metadata storage, permissions and HTTP/WebSocket registration. Browser DOM tests exercise the bundled panel/card without a build step. No production Home Assistant instance or credentials are used.

Use the manual **Release** workflow on `main`, choosing a semantic version bump. It runs CI, updates matching manifest/project versions, creates a tag, and uploads `lists_plus.zip`. Published manual releases are also verified and packaged. Do not release versions that have not passed CI.
