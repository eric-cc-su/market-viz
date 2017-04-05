from pipeline_browserify.compiler import BrowserifyCompiler

class BrowserifyCompiler(BrowserifyCompiler):
    def is_outdated(self, infile, outfile):
        return True