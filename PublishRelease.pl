#!/usr/bin/perl
# This will automate the project build and release creation
# Ideally this would be automated as a GH action. But the tauri provided workflow did not behave as documented.

# my $

sub run {
	my $cmd = shift;
	print "$cmd\n";
	my $error = system($cmd);
	die "Command: $cmd returned non nil error code." if $error;
}

# Ensure latest github cli
run "brew upgrade gh";

# Build the application bundles
run "CI=true yarn tauri build";
