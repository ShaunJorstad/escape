#!/usr/bin/perl
# This will automate the project build and release creation
# Ideally this would be automated as a GH action. But the tauri provided workflow did not behave as documented.

# Check for dirty files
my $dirtyFiles = `git status --porcelain`;
chomp $dirtyFiles;
die "Stash all local changes prior to starting a release." unless $dirtyFiles eq "";

my $line = "\n---------------------------\n";
print "Starting Release Process$line";

sub run {
	my $cmd = shift;
	print "$cmd\n";
	my $error = system($cmd);
	die "Command: $cmd returned non nil error code." if $error;
}

# Ensure latest github cli
print "Updating gh cli $line";
# run "brew upgrade gh";

# Read in current perl version
my $current_version;
my $config_path = "./src-tauri/tauri.conf.json";
open(FH, '<', $config_path) or die $!;
my $full_content = "";
while(<FH>) {
   $full_content .= $_;
}
close(FH);
$current_version = ($full_content =~ /(\d\.\d\.\d)/g)[0];

# Prompt for next version number:
print "Current Version: $current_version\n";
print "New Version Number: ";
my $new_version = <STDIN>;
chomp $new_version;
exit 1 if $new_version eq "";

# Replace version in tauri config
print "Updating tauri.conf.json $line";
my ($a, $b, $c) = split(/"version": "(0-9|.+)"/, $full_content);
$b = "\"version\": \"$new_version\"";
$full_content = $a . $b . $c;
open(FH, '>', $config_path) or die $!;
print FH $full_content;
close(FH);


# REMAINING ITEMS:
# commit version change
run "git add . && git commit -m 'Version bump.'";
# Tag commit with version change
run "git tag v$new_version";
run "git push";
run "git push origin v$new_version";
# Start the workflow:
run "gh workflow run";

# Now we need to update the GH gist to point to 

